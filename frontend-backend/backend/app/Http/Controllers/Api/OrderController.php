<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->orders()->with(['details.product', 'payment'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_id' => ['required', 'integer', 'exists:stores,id'],
            'address' => ['required', 'string', 'max:1000'],
            'payment_method' => ['required', 'in:transfer,qris,dana,cod'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $result = DB::transaction(function () use ($request, $validated) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'store_id' => $validated['store_id'],
                'address' => $validated['address'],
                'payment_method' => $validated['payment_method'],
                'status' => 'pending',
            ]);

            $amount = 0;
            $items = [];
            foreach ($validated['items'] as $item) {
                $product = \App\Models\Product::where('id', $item['product_id'])
                    ->where('store_id', $validated['store_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$product || $product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ['Produk tidak ditemukan atau stok tidak mencukupi.'],
                    ]);
                }

                $product->decrement('stock', $item['quantity']);
                $lineTotal = (float) $product->price * $item['quantity'];
                $amount += $lineTotal;
                $order->details()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                ]);
                $items[] = [
                    'id' => (string) $product->id,
                    'price' => (int) round($product->price),
                    'quantity' => $item['quantity'],
                    'name' => Str::limit($product->name, 50, ''),
                ];
            }

            $gatewayOrderId = 'ORDER-' . $order->id . '-' . Str::upper(Str::random(8));
            $payment = $order->payment()->create([
                'method' => $validated['payment_method'],
                'amount' => $amount,
                'status' => $validated['payment_method'] === 'cod' ? 'pending' : 'pending',
                'gateway_order_id' => $gatewayOrderId,
            ]);

            return compact('order', 'payment', 'amount', 'items', 'gatewayOrderId');
        });

        $response = $this->makeGatewayResponse($result, $request->user());
        $result['order']->load(['details.product', 'payment']);

        return response()->json([
            'order' => $result['order'],
            'snap_token' => $response['snap_token'] ?? null,
            'snap_redirect_url' => $response['redirect_url'] ?? null,
        ], 201);
    }

    public function show(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id, 403);
        return response()->json($order->load(['details.product', 'payment']));
    }

    public function payment(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id, 403);
        return response()->json($order->payment);
    }

    public function notification(Request $request)
    {
        $payload = $request->all();
        $signature = hash('sha512', ($payload['order_id'] ?? '') . ($payload['status_code'] ?? '') . ($payload['gross_amount'] ?? '') . config('services.midtrans.server_key'));

        abort_unless(hash_equals($signature, $payload['signature_key'] ?? ''), 403);

        $payment = Payment::where('gateway_order_id', $payload['order_id'] ?? '')->firstOrFail();
        $status = $payload['transaction_status'] ?? 'pending';
        $paymentStatus = match ($status) {
            'settlement', 'capture' => 'paid',
            'deny', 'cancel', 'expire', 'failure' => 'failed',
            default => 'pending',
        };

        $payment->update([
            'status' => $paymentStatus,
            'gateway_transaction_id' => $payload['transaction_id'] ?? null,
            'gateway_response' => json_encode($payload),
            'paid_at' => $paymentStatus === 'paid' ? ($payload['settlement_time'] ?? now()) : null,
        ]);

        // Status order mengikuti pembayaran dengan istilah milik order.
        $orderStatus = match ($paymentStatus) {
            'paid' => 'processing',
            'failed' => 'cancelled',
            default => 'pending',
        };
        $payment->order()->update(['status' => $orderStatus]);

        return response()->json(['message' => 'Notification processed']);
    }

    private function makeGatewayResponse(array $result, $user): array
    {
        if ($result['order']->payment_method === 'cod') {
            return [];
        }

        $serverKey = config('services.midtrans.server_key');
        if (!$serverKey) {
            throw ValidationException::withMessages([
                'payment_method' => ['Midtrans belum dikonfigurasi. Isi MIDTRANS_SERVER_KEY di file .env.'],
            ]);
        }

        $response = Http::withBasicAuth($serverKey, '')
            ->acceptJson()
            ->post(config('services.midtrans.snap_url') . '/snap/v1/transactions', [
                'transaction_details' => [
                    'order_id' => $result['gatewayOrderId'],
                    'gross_amount' => (int) round($result['amount']),
                ],
                'item_details' => $result['items'],
                'customer_details' => [
                    'first_name' => $user->name,
                    'email' => $user->email,
                ],
                'enabled_payments' => $this->enabledPayments($result['order']->payment_method),
            ]);

        if ($response->failed()) {
            $result['payment']->update(['status' => 'failed', 'gateway_response' => $response->body()]);
            $result['order']->update(['status' => 'failed']);
            abort(502, 'Gagal membuat transaksi Midtrans.');
        }

        $result['payment']->update(['gateway_response' => $response->body()]);
        return $response->json();
    }

    private function enabledPayments(string $method): array
    {
        return match ($method) {
            'qris' => ['qris'],
            'dana' => ['dana'],
            default => ['bank_transfer'],
        };
    }
}

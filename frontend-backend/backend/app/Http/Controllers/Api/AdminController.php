<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    // GET /api/admin/stats — ringkasan angka dashboard
    public function stats()
    {
        $revenue = \App\Models\Payment::where('status', 'paid')->sum('amount');

        return response()->json([
            'users' => User::count(),
            'stores' => Store::count(),
            'products' => Product::count(),
            'orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'revenue' => (float) $revenue,
        ]);
    }

    // GET /api/admin/products?search=
    public function products(Request $request)
    {
        $query = Product::with(['store', 'detail']);

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where('name', 'like', "%{$search}%");
        }

        $products = $query->latest()->paginate(20)->withQueryString();

        $products->getCollection()->transform(fn ($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'price' => (float) $p->price,
            'stock' => (int) $p->stock,
            'store_id' => $p->store_id,
            'store_name' => $p->store?->name,
            'image_url' => $p->image_url,
            'created_at' => $p->created_at,
        ]);

        return response()->json($products);
    }

    // DELETE /api/admin/products/{product}
    public function destroyProduct(Product $product)
    {
        $imagePath = $product->image_path;
        $product->detail()->delete();
        $product->delete();
        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        return response()->json(['message' => 'Produk dihapus oleh admin.']);
    }

    // GET /api/admin/orders?status=
    public function orders(Request $request)
    {
        $query = Order::with(['details.product', 'payment', 'user', 'store']);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json($query->latest()->paginate(20)->withQueryString());
    }

    // PUT /api/admin/orders/{order}/status — pending/processing/shipped/completed/cancelled
    public function updateOrderStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,completed,cancelled',
        ], [
            'status.in' => 'Status tidak valid.',
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Status pesanan diperbarui.',
            'data' => $order->fresh()->load(['details.product', 'payment', 'user', 'store']),
        ]);
    }

    // GET /api/admin/stores?search=
    public function stores(Request $request)
    {
        $query = Store::with('user')->withCount('products');

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where('name', 'like', "%{$search}%");
        }

        return response()->json($query->latest()->paginate(20)->withQueryString());
    }

    // DELETE /api/admin/stores/{store}
    public function destroyStore(Store $store)
    {
        $store->delete();

        return response()->json(['message' => 'Toko beserta produknya dihapus oleh admin.']);
    }

    // GET /api/admin/users?search=
    public function users(Request $request)
    {
        $query = User::withCount(['store', 'orders']);

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
        }

        // stores_count dihitung manual karena relasi hasOne (withCount memberi 0/1).
        $users = $query->latest()->paginate(20)->withQueryString();
        $users->getCollection()->transform(fn ($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'is_admin' => (bool) $u->is_admin,
            'has_store' => $u->store()->exists(),
            'orders_count' => $u->orders_count,
            'created_at' => $u->created_at,
        ]);

        return response()->json($users);
    }

    // PUT /api/admin/users/{user}/admin — angkat/turunkan admin
    public function setAdmin(Request $request, User $user)
    {
        $validated = $request->validate([
            'is_admin' => 'required|boolean',
        ]);

        if ($user->id === $request->user()->id && ! $validated['is_admin']) {
            return response()->json(['message' => 'Anda tidak bisa mencabut admin diri sendiri.'], 422);
        }

        $user->update(['is_admin' => $validated['is_admin']]);

        return response()->json([
            'message' => $user->is_admin ? "{$user->name} sekarang admin." : "Akses admin {$user->name} dicabut.",
            'data' => $user->fresh(),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // GET /products — daftar semua produk (publik)
    public function index(Request $request)
    {
        $query = Product::with(['detail', 'store']);

        if ($request->has('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        $products = $query->latest()->paginate(20);

        return response()->json($products);
    }

    // GET /products/{product} — detail satu produk (publik)
    public function show(Product $product)
    {
        $product->load(['detail', 'store']);

        return response()->json($product);
    }

    // POST /products — tambah produk (wajib login)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'description' => 'nullable|string',
            'weight'      => 'nullable|numeric|min:0',
        ]);

        $store = $request->user()->store;

        if (!$store) {
            return response()->json(['message' => 'Anda belum memiliki toko.'], 403);
        }

        $product = Product::create([
            'store_id' => $store->id,
            'name'     => $validated['name'],
            'price'    => $validated['price'],
            'stock'    => $validated['stock'],
        ]);

        // Simpan detail (description, weight) jika ada
        $product->detail()->create([
            'description' => $validated['description'] ?? null,
            'weight'      => $validated['weight'] ?? null,
        ]);

        $product->load('detail');

        return response()->json($product, 201);
    }

    // PUT /products/{product} — update produk (wajib login)
    public function update(Request $request, Product $product)
    {
        if ($product->store->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan.'], 403);
        }

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'price'       => 'sometimes|required|numeric|min:0',
            'stock'       => 'sometimes|required|integer|min:0',
            'description' => 'nullable|string',
            'weight'      => 'nullable|numeric|min:0',
        ]);

        $product->update($request->only(['name', 'price', 'stock']));

        if ($request->has('description') || $request->has('weight')) {
            $product->detail()->updateOrCreate(
                ['product_id' => $product->id],
                $request->only(['description', 'weight'])
            );
        }

        $product->load('detail');

        return response()->json($product);
    }

    // DELETE /products/{product} — hapus produk (wajib login)
    public function destroy(Request $request, Product $product)
    {
        if ($product->store->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan.'], 403);
        }

        $product->delete(); // pastikan ada cascade delete di migration untuk product_details

        return response()->json(['message' => 'Produk berhasil dihapus.']);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Bentuk response standar agar frontend tidak perlu menebak struktur.
     */
    protected function formatProduct(Product $product): array
    {
        $product->loadMissing(['detail', 'store']);

        return [
            'id' => $product->id,
            'store_id' => $product->store_id,
            'store_name' => $product->store?->name,
            'name' => $product->name,
            'price' => (float) $product->price,
            'stock' => (int) $product->stock,
            'description' => $product->detail?->description,
            'weight' => $product->detail?->weight !== null ? (float) $product->detail->weight : null,
            'image_path' => $product->image_path,
            'image_url' => $product->image_url,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ];
    }

    // GET /api/products — publik, support ?search= & ?store_id=
    public function index(Request $request)
    {
        $query = Product::with(['detail', 'store']);

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->input('store_id'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('detail', fn ($d) => $d->where('description', 'like', "%{$search}%"));
            });
        }

        $products = $query->latest()->paginate(24)->withQueryString();

        $products->getCollection()->transform(fn ($p) => $this->formatProduct($p));

        return response()->json($products);
    }

    // GET /api/products/{product} — publik
    public function show(Product $product)
    {
        return response()->json(['data' => $this->formatProduct($product)]);
    }

    // POST /api/products — wajib login + punya toko. Upload gambar via field "image".
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0|max:999999999',
            'stock' => 'required|integer|min:0|max:1000000',
            'description' => 'nullable|string|max:5000',
            'weight' => 'nullable|numeric|min:0|max:1000000',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'name.required' => 'Nama produk wajib diisi.',
            'price.required' => 'Harga wajib diisi.',
            'price.numeric' => 'Harga harus berupa angka.',
            'stock.required' => 'Stok wajib diisi.',
            'image.image' => 'File harus berupa gambar.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
            'image.mimes' => 'Gambar harus JPG, PNG, atau WebP.',
        ]);

        $store = $request->user()->store;

        if (! $store) {
            return response()->json(['message' => 'Anda belum memiliki toko. Buat toko dulu sebelum menambah produk.'], 403);
        }

        $product = Product::create([
            'store_id' => $store->id,
            'name' => $validated['name'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'image_path' => $request->hasFile('image')
                ? $request->file('image')->store('products', 'public')
                : null,
        ]);

        $product->detail()->create([
            'description' => $validated['description'] ?? null,
            'weight' => $validated['weight'] ?? null,
        ]);

        return response()->json(['data' => $this->formatProduct($product->fresh())], 201);
    }

    // PUT /api/products/{product} — wajib login, hanya pemilik toko.
    // Untuk upload file: kirim POST + _method=PUT (sudah ditangani frontend).
    public function update(Request $request, Product $product)
    {
        if ((int) $product->store->user_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan mengubah produk ini.'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'price' => 'sometimes|required|numeric|min:0|max:999999999',
            'stock' => 'sometimes|required|integer|min:0|max:1000000',
            'description' => 'nullable|string|max:5000',
            'weight' => 'nullable|numeric|min:0|max:1000000',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'remove_image' => 'nullable|boolean',
        ], [
            'name.required' => 'Nama produk wajib diisi.',
            'image.image' => 'File harus berupa gambar.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
            'image.mimes' => 'Gambar harus JPG, PNG, atau WebP.',
        ]);

        $product->update($request->only(['name', 'price', 'stock']));

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $product->update([
                'image_path' => $request->file('image')->store('products', 'public'),
            ]);
        } elseif ($request->boolean('remove_image') && $product->image_path) {
            Storage::disk('public')->delete($product->image_path);
            $product->update(['image_path' => null]);
        }

        if ($request->has('description') || $request->has('weight')) {
            $product->detail()->updateOrCreate(
                ['product_id' => $product->id],
                [
                    'description' => $request->input('description'),
                    'weight' => $request->input('weight'),
                ]
            );
        }

        return response()->json(['data' => $this->formatProduct($product->fresh())]);
    }

    // DELETE /api/products/{product}
    public function destroy(Request $request, Product $product)
    {
        if ((int) $product->store->user_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Tidak diizinkan menghapus produk ini.'], 403);
        }

        $imagePath = $product->image_path;
        $product->detail()->delete();
        $product->delete();

        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        return response()->json(['message' => 'Produk berhasil dihapus.']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    protected function formatStore(Store $store): array
    {
        $store->loadMissing(['user']);

        return [
            'id' => $store->id,
            'user_id' => $store->user_id,
            'user_name' => $store->user?->name,
            'name' => $store->name,
            'address' => $store->address,
            'phone' => $store->phone,
            'products_count' => $store->products()->count(),
            'created_at' => $store->created_at,
            'updated_at' => $store->updated_at,
        ];
    }

    // GET /api/stores — publik
    public function index()
    {
        return Store::with('user')->latest()->get()->map(fn ($s) => $this->formatStore($s));
    }

    // GET /api/stores/{store} — publik
    public function show(Store $store)
    {
        return response()->json(['data' => $this->formatStore($store)]);
    }

    // GET /api/my-store — toko milik user login (1 user = 1 toko)
    public function myStore(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            return response()->json(['message' => 'Anda belum memiliki toko.', 'data' => null], 404);
        }

        return response()->json(['data' => $this->formatStore($store)]);
    }

    // POST /api/my-store — buka toko baru
    public function storeMyStore(Request $request): JsonResponse
    {
        // Pakai query langsung (bukan relasi cached) agar pengecekan selalu akurat.
        if ($request->user()->store()->exists()) {
            return response()->json(['message' => 'Satu akun hanya boleh memiliki satu toko.'], 409);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:stores,name',
            'address' => 'required|string|max:1000',
            'phone' => 'nullable|string|max:30',
        ], [
            'name.required' => 'Nama toko wajib diisi.',
            'name.unique' => 'Nama toko ini sudah digunakan.',
            'address.required' => 'Alamat toko wajib diisi.',
        ]);

        $store = Store::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'address' => $validated['address'],
            'phone' => $validated['phone'] ?? null,
        ]);

        // Otomatis tercatat di tabel stores → tampil di dashboard admin (/admin).
        return response()->json([
            'message' => 'Toko berhasil dibuat dan terdaftar di dashboard admin.',
            'data' => $this->formatStore($store->fresh()),
        ], 201);
    }

    // PUT /api/my-store — ubah data toko sendiri
    public function updateMyStore(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            return response()->json(['message' => 'Anda belum memiliki toko.'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:stores,name,'.$store->id,
            'address' => 'required|string|max:1000',
            'phone' => 'nullable|string|max:30',
        ], [
            'name.required' => 'Nama toko wajib diisi.',
            'name.unique' => 'Nama toko ini sudah digunakan.',
            'address.required' => 'Alamat toko wajib diisi.',
        ]);

        $store->update($validated);

        return response()->json([
            'message' => 'Data toko berhasil diperbarui.',
            'data' => $this->formatStore($store->fresh()),
        ]);
    }

    // Legacy (dipakai Filament/darat): buat toko untuk user tertentu
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255|unique:stores,name',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:30',
        ]);

        return Store::create($validated);
    }

    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255|unique:stores,name,'.$store->id,
            'address' => 'required|string',
            'phone' => 'nullable|string|max:30',
        ]);

        $store->update($validated);

        return $store;
    }

    public function destroy(Store $store)
    {
        $store->delete();

        return response()->noContent();
    }
}

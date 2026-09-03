<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index()
    {
        return Store::with('user')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255|unique:stores,name',
            'address' => 'required|string',
        ]);

        return Store::create($validated);
    }

    public function show(Store $store)
    {
        return $store->load('user');
    }

    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255|unique:stores,name,' . $store->id,
            'address' => 'required|string',
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
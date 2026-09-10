<?php

use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Support\Facades\Route;

// Publik — tidak perlu login
Route::get('/stores', [StoreController::class, 'index']);
Route::get('/stores/{store}', [StoreController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Wajib login
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Illuminate\Http\Request $request) => $request->user());

    Route::get('/my-store', [StoreController::class, 'myStore']);
    Route::post('/my-store', [StoreController::class, 'storeMyStore']);
    Route::put('/my-store', [StoreController::class, 'updateMyStore']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::apiResource('orders', OrderController::class)->only(['index', 'store', 'show']);
    Route::get('/orders/{order}/payment', [OrderController::class, 'payment']);

    Route::get('/produk', [ProductController::class, 'index']);
    Route::get('/produk/{product}', [ProductController::class, 'show']);
});
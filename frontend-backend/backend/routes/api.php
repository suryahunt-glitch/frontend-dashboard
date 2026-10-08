<?php

use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

Route::post('/payments/midtrans/notification', [OrderController::class, 'notification']);

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

    // Khusus admin (React /admin + Filament setara)
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/products', [AdminController::class, 'products']);
        Route::delete('/products/{product}', [AdminController::class, 'destroyProduct']);
        Route::get('/orders', [AdminController::class, 'orders']);
        Route::put('/orders/{order}/status', [AdminController::class, 'updateOrderStatus']);
        Route::get('/stores', [AdminController::class, 'stores']);
        Route::delete('/stores/{store}', [AdminController::class, 'destroyStore']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{user}/admin', [AdminController::class, 'setAdmin']);
    });
});
<?php

use App\Http\Controllers\Api\StoreController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('stores', StoreController::class);
});
<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

// Pendaftaran publik DINONAKTIFKAN: akun hanya dibuat oleh admin lewat
// dashboard (/admin → Users). Login memakai akun yang sudah ada di dashboard.
Route::post('/register', function () {
    return response()->json([
        'message' => 'Pendaftaran akun baru hanya melalui admin. Hubungi admin untuk dibuatkan akun.',
    ], 403);
})->name('register');

// Tanpa middleware 'guest': user yang sedang login (mis. akun demo) tetap bisa
// login ulang sebagai akun lain (mis. akun admin) tanpa harus logout dulu.
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

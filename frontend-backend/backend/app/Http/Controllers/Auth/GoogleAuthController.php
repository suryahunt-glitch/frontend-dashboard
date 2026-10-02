<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable $exception) {
            return $this->loginFailed();
        }

        $googleId = $googleUser->getId();
        $email = $googleUser->getEmail();

        if (! $googleId || ! $email) {
            return $this->loginFailed();
        }

        $user = User::query()->where('google_id', $googleId)->first();

        if (! $user) {
            $user = User::query()->where('email', $email)->first();
        }

        if ($user && $user->google_id && $user->google_id !== $googleId) {
            return $this->loginFailed();
        }

        if (! $user) {
            $user = new User();
            $user->name = $googleUser->getName();
            $user->email = $email;
            $user->password = Hash::make(Str::random(40));
        }

        $user->google_id = $googleId;
        $user->email_verified_at = $user->email_verified_at ?? now();
        $user->save();

        Auth::login($user, true);
        request()->session()->regenerate();

        return redirect(config('services.frontend_url', 'http://localhost:5173'));
    }

    protected function loginFailed()
    {
        return redirect(rtrim(config('services.frontend_url', 'http://localhost:5173'), '/').'/login?google=failed');
    }
}

<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'is_admin'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements \Filament\Models\Contracts\FilamentUser
{
    use HasFactory;

    // Hanya admin yang boleh masuk dashboard Filament (/admin).
    public function canAccessPanel(\Filament\Panel $panel): bool
    {
        return (bool) $this->is_admin;
    }

    public function isAdmin(): bool
    {
        return (bool) $this->is_admin;
    }

    public function store()
    {
        return $this->hasOne(Store::class);
    }

public function orders()
{
    return $this->hasMany(Order::class);
}
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }
}

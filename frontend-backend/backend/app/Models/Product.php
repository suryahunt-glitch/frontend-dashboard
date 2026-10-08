<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = ['store_id', 'name', 'price', 'stock', 'image_path'];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        $relative = Storage::disk('public')->url($this->image_path);

        // Kembalikan URL absolut agar bisa diakses dari frontend (Vite) yang beda origin.
        if (str_starts_with($relative, 'http')) {
            return $relative;
        }

        return rtrim(config('app.url', 'http://localhost:8000'), '/').$relative;
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function detail()
    {
        return $this->hasOne(ProductDetail::class);
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
}

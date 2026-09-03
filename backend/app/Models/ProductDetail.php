<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductDetail extends Model
{
    protected $fillable = [
        'product_id',
        'description',
        'weight',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
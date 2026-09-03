<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['store_id', 'name', 'price', 'stock'];

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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
      protected $fillable = [
        'user_id',
        'name',
        'address',
    ];

    public function user()
{
    return $this->belongsTo(\App\Models\User::class);
}

public function employees()
{
    return $this->hasMany(Employee::class);
}

public function products()
{
    return $this->hasMany(Product::class);
}
}

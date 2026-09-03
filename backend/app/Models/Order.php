<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public function user()
{
    return $this->belongsTo(User::class);
}

public function details()
{
    return $this->hasMany(OrderDetail::class);
}

public function payment()
{
    return $this->hasOne(Payment::class);
}

public function orderDetails()
{
    return $this->hasMany(OrderDetail::class);
}
}

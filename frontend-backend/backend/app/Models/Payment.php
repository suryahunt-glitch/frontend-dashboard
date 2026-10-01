<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'method',
        'amount',
        'status',
        'gateway_order_id',
        'gateway_transaction_id',
        'gateway_response',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function paymentDetails()
    {
        return $this->hasMany(PaymentDetail::class);
    }
}
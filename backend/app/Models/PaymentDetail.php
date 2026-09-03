<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentDetail extends Model
{
    protected $fillable = [
        'payment_id',
        'method',
        'amount',
        'status',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
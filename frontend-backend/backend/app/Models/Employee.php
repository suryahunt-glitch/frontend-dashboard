<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    public function store()
{
    return $this->belongsTo(Store::class);
}

public function detail()
{
    return $this->hasOne(EmployeeDetail::class);
}
}

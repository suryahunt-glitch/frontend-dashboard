<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeDetail extends Model
{
    public function employee()
{
    return $this->belongsTo(Employee::class);
}
}

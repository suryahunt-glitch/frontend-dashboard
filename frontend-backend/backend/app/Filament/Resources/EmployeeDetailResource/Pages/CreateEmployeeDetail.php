<?php

namespace App\Filament\Resources\EmployeeDetailResource\Pages;

use App\Filament\Resources\EmployeeDetailResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateEmployeeDetail extends CreateRecord
{
    protected static string $resource = EmployeeDetailResource::class;
}

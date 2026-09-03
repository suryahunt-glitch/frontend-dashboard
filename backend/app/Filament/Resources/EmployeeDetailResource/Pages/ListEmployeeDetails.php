<?php

namespace App\Filament\Resources\EmployeeDetailResource\Pages;

use App\Filament\Resources\EmployeeDetailResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListEmployeeDetails extends ListRecords
{
    protected static string $resource = EmployeeDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}

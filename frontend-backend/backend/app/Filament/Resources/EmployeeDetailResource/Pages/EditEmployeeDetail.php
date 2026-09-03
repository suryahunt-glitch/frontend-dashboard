<?php

namespace App\Filament\Resources\EmployeeDetailResource\Pages;

use App\Filament\Resources\EmployeeDetailResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditEmployeeDetail extends EditRecord
{
    protected static string $resource = EmployeeDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}

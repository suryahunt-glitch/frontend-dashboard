<?php

namespace App\Filament\Resources\OrderDetailResource\Pages;

use App\Filament\Resources\OrderDetailResource;
use Filament\Resources\Pages\CreateRecord;

class CreateOrderDetail extends CreateRecord
{
    protected static string $resource = OrderDetailResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
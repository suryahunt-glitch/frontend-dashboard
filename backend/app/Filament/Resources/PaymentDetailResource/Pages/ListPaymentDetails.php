<?php

namespace App\Filament\Resources\PaymentDetailResource\Pages;

use App\Filament\Resources\PaymentDetailResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPaymentDetails extends ListRecords
{
    protected static string $resource = PaymentDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
        ];
    }
}
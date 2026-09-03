<?php

namespace App\Filament\Resources\PaymentDetailResource\Pages;

use App\Filament\Resources\PaymentDetailResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePaymentDetail extends CreateRecord
{
    protected static string $resource = PaymentDetailResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
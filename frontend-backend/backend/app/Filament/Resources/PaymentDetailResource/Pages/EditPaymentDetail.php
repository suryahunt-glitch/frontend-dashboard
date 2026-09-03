<?php

namespace App\Filament\Resources\PaymentDetailResource\Pages;

use App\Filament\Resources\PaymentDetailResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPaymentDetail extends EditRecord
{
    protected static string $resource = PaymentDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
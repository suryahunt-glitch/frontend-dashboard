<?php

namespace App\Filament\Resources\StoreResource\Pages;

use App\Filament\Resources\StoreResource;
use App\Models\Store;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreateStore extends CreateRecord
{
    protected static string $resource = StoreResource::class;

    protected function beforeCreate(): void
    {
        $userId = $this->data['user_id'] ?? null;

        if (!$userId) {
            return;
        }

        $hasStore = Store::where('user_id', $userId)->exists();

        if ($hasStore) {
            Notification::make()
                ->title('User sudah memiliki store')
                ->body('User ini telah memiliki store dan tidak dapat membuat store lagi.')
                ->danger()
                ->send();

            $this->halt();
        }
    }
}
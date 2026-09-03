<?php

namespace App\Filament\Resources\ProductDetailResource\Pages;

use App\Filament\Resources\ProductDetailResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateProductDetail extends CreateRecord
{
    protected static string $resource = ProductDetailResource::class;
}

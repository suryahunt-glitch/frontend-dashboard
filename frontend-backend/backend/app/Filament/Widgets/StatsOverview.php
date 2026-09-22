<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use App\Models\Order;
use App\Models\Store;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Produk', Product::count())
                ->description('Semua produk aktif')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('success'),

            Stat::make('Total Toko', Store::count())
                ->description('Toko terdaftar')
                ->descriptionIcon('heroicon-m-building-storefront')
                ->color('warning'),

            Stat::make('Total Order', Order::count())
                ->description('Pesanan masuk')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->color('primary'),
        ];
    }
}
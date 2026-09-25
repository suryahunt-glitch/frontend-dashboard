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

            Stat::make('Stok Menipis', Product::whereBetween('stock', [1, 5])->count())
                ->description('Produk dengan stok 1-5')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->color('danger'),

            Stat::make('Nilai Inventaris', 'Rp ' . number_format(
                Product::selectRaw('COALESCE(SUM(price * stock), 0) as total')->value('total'),
                0,
                ',',
                '.'
            ))
                ->description('Harga x stok tersedia')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
        ];
    }
}
<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentDetailResource\Pages;
use App\Models\PaymentDetail;
use Filament\Forms\Form;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Resources\Resource;

class PaymentDetailResource extends Resource
{
    protected static ?string $model = PaymentDetail::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('payment_id')
                    ->label('Payment')
                    ->relationship('payment', 'id')
                    ->getOptionLabelFromRecordUsing(fn ($record) => "#{$record->id} - {$record->method} - Rp{$record->amount}")
                    ->required()
                    ->searchable()
                    ->preload(),

                TextInput::make('method')
                    ->required()
                    ->maxLength(255),

                TextInput::make('amount')
                    ->required()
                    ->numeric()
                    ->prefix('Rp'),

                Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'failed' => 'Failed',
                    ])
                    ->default('pending')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->sortable(),

                TextColumn::make('payment.id')
                    ->label('Payment ID')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('method')
                    ->searchable(),

                TextColumn::make('amount')
                    ->money('IDR')
                    ->sortable(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'paid' => 'success',
                        'failed' => 'danger',
                        default => 'gray',
                    })
                    ->searchable(),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                \Filament\Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                \Filament\Tables\Actions\BulkActionGroup::make([
                    \Filament\Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPaymentDetails::route('/'),
            'create' => Pages\CreatePaymentDetail::route('/create'),
            'edit' => Pages\EditPaymentDetail::route('/{record}/edit'),
        ];
    }
}
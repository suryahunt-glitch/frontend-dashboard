<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('store_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            $table->text('address')->nullable()->after('store_id');
            $table->string('payment_method')->nullable()->after('address');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('amount');
            $table->string('gateway_order_id')->nullable()->unique()->after('status');
            $table->string('gateway_transaction_id')->nullable()->after('gateway_order_id');
            $table->text('gateway_response')->nullable()->after('gateway_transaction_id');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'gateway_order_id',
                'gateway_transaction_id',
                'gateway_response',
            ]);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['store_id']);
            $table->dropColumn(['store_id', 'address', 'payment_method']);
        });
    }
};

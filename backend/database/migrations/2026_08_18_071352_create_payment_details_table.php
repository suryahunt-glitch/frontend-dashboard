<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('payment_details', function (Blueprint $table) {
        $table->id();
        $table->foreignId('payment_id')->constrained()->cascadeOnDelete();
        $table->string('method'); // contoh: transfer, cash, e-wallet
        $table->decimal('amount', 15, 2);
        $table->string('status')->default('pending');
        $table->timestamps();
    });
} 

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_details');
    }
};

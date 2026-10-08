<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('stores', 'phone')) {
            Schema::table('stores', function (Blueprint $table) {
                $table->string('phone', 30)->nullable()->after('address');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('stores', 'phone')) {
            Schema::table('stores', function (Blueprint $table) {
                $table->dropColumn('phone');
            });
        }
    }
};

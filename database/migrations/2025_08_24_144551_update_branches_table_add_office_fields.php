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
        Schema::table('branches', function (Blueprint $table) {
            $table->string('images')->nullable()->after('name');
            $table->string('fax', 21)->nullable()->after('phone');
            $table->integer('country_id')->default(1)->after('district');
            $table->integer('province_id')->default(0)->after('country_id');
            $table->float('geo_lat')->default(0)->after('province_id');
            $table->float('geo_lng')->default(0)->after('geo_lat');
            $table->integer('ordering')->default(1)->after('is_active');
            $table->foreignId('created_by')->nullable()->constrained('users')->after('ordering');
            $table->foreignId('updated_by')->nullable()->constrained('users')->after('created_by');
            $table->string('language', 2)->default('vi')->after('updated_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            $table->dropColumn([
                'images', 'fax', 'country_id', 'province_id', 
                'geo_lat', 'geo_lng', 'ordering', 'created_by', 
                'updated_by', 'language'
            ]);
        });
    }
};

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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('car_name'); 
            $table->string('fuel_type'); 
            $table->decimal('price_per_day', 10, 2); 
            $table->text('description', 2000)->nullable(); 
            $table->string('image')->nullable(); 
            $table->string('gear_type');
            $table->string('VIN')->unique(); 
            $table->string('registration')->unique(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};

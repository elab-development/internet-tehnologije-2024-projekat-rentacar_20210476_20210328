<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand',
        'model',
        'fuel_type',
        'price_per_day',
        'description',
        'image',
        'gear_type',
        'VIN',
        'registration',
        'properties',
        'production_year',
    ];

    protected $casts = [
        'properties' => 'array', // Cast JSON properties to an array
    ];

    public function rents()
    {
        return $this->hasMany(Rent::class);
    }
}

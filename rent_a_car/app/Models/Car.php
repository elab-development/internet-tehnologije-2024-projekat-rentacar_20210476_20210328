<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;
    protected $fillable = [
        'car_name',
        'fuel_type',
        'price_per_day',
        'description',
        'image',
        'gear_type',
        'VIN',
        'registration',
        'production_year',
    ];
    public $timestamps = false;

    public function rents()
    {
        return $this->hasMany(Rent::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'rent_id',
        'review',
        'rating',
    ];

    public function rent()
    {
        return $this->belongsTo(Rent::class);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Http\Resources\CarResource;

class CarController extends Controller
{
    /**
     * Prikaz svih automobila.
     * Dostupno svim korisnicima, uključujući neulogovane.
     */
    public function index()
    {
        $cars = Car::all();

        return response()->json(['cars' => CarResource::collection($cars)], 200);
    }
}

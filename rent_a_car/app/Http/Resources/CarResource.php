<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'car_name' => $this->car_name,
            'fuel_type' => $this->fuel_type,
            'price_per_day' => $this->price_per_day,
            'description' => $this->description,
            'image' => $this->image,
            'gear_type' => $this->gear_type,
            'VIN' => $this->VIN,
            'registration' => $this->registration,
            'production_year' => $this->production_year,
        ];
    }
}

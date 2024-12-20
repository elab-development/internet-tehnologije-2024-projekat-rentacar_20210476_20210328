<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'car' => [
                'id' => $this->car->id,
                'brand' => $this->car->brand,
                'model' => $this->car->model,
                'fuel_type' => $this->car->fuel_type,
                'price_per_day' => $this->car->price_per_day,
            ],
            'rent_start_date' => $this->rent_start_date,
            'rent_end_date' => $this->rent_end_date,
            'total_price' => $this->total_price,
        ];
    }
}

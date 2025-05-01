<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'review' => $this->review,
            'rating' => $this->rating,
            'rent' => [
                'id' => $this->rent->id,
                'user' => [
                    'id' => $this->rent->user->id,
                    'name' => $this->rent->user->name,
                    'email' => $this->rent->user->email,
                ],
                'car' => [
                    'id' => $this->rent->car->id,
                    'car_name' => $this->rent->car->car_name,
                    'price_per_day' => $this->rent->car->price_per_day,
                ],
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

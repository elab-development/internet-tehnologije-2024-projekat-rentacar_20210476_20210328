<?php

namespace Database\Factories;

use App\Models\Rent;
use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'rent_id' => Rent::factory(), 
            'review' => $this->faker->text(500), 
            'rating' => $this->faker->numberBetween(1, 5), 
        ];
    }
}

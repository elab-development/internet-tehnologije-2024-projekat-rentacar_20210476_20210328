<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\Rent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rent>
 */
class RentFactory extends Factory
{
    protected $model = Rent::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'car_id' => Car::factory(), 
            'rent_start_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'rent_end_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'total_price' => $this->faker->randomFloat(2, 100, 1000), 
        ];
    }
}

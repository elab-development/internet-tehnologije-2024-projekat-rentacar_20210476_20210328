<?php

namespace Database\Factories;

use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    protected $model = Car::class;

    public function definition(): array
    {
        return [
            'brand' => $this->faker->company,
            'model' => $this->faker->word,
            'fuel_type' => $this->faker->randomElement(['petrol', 'diesel', 'electric', 'hybrid']),
            'price_per_day' => $this->faker->randomFloat(2, 50, 500), 
            'description' => $this->faker->paragraph,
            'image' => $this->faker->imageUrl(640, 480, 'cars'),
            'gear_type' => $this->faker->randomElement(['automatic', 'manual']),
            'VIN' => $this->faker->unique()->regexify('[A-HJ-NPR-Z0-9]{17}'),
            'registration' => $this->faker->unique()->regexify('[A-Z]{2}[0-9]{5}'), 
            'properties' => $this->faker->randomElements(['color' => 'red', 'doors' => 4], 1), 
            'production_year' => $this->faker->year,
        ];
    }
}

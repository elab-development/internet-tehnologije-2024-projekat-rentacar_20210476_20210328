<?php

namespace Database\Factories;

use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

class CarFactory extends Factory
{
    protected $model = Car::class;

    public function definition(): array
    {
        $abbreviationsForCities = [
            'RA', 'RU', 'SA', 'SV', 'SD', 'SJ', 'SM', 'SO', 'SP', 'ST', 'SU', 
            'TO', 'TS', 'TT', 'ĆU', 'UB', 'UE', 'UR', 'ČA', 'ŠA', 'ŠI', 'NI', 
            'NP', 'NS', 'PA', 'PB', 'PE', 'PŽ', 'PZ', 'PI', 'PK', 'PN', 'PO', 
            'PP', 'PR', 'PT', 'VB', 'VL', 'VP', 'VR', 'VS', 'VŠ', 'GL', 'GM', 
            'DE', 'ĐA', 'ZA', 'ZR', 'IN', 'IC', 'JA', 'KA', 'KV', 'KG', 'KŽ', 
            'KI', 'KL', 'KM', 'KO', 'KC', 'KŠ', 'LB', 'LE', 'LO', 'LU', 'NV', 
            'NG', 'AL', 'AR', 'AC', 'BB', 'BG', 'BO', 'BP', 'BT', 'BĆ', 'BU', 
            'BČ', 'VA'
        ];
        $cityAbbreviation = $this->faker->randomElement($abbreviationsForCities);

        $car = (new \Faker\Factory())::create();
        $car->addProvider(new \Faker\Provider\Fakecar($car));
        $carName = $car->vehicle();

        return [
            'car_name' => $carName,
            'fuel_type' => $car->vehicleFuelType(),
            'price_per_day' => $this->faker->randomFloat(2, 50, 500), 
            'description' => $carName . ' is the ' . $this->faker->word(),
            'image' => $this->faker->imageUrl(640, 480, 'cars'),
            'gear_type' => $car->vehicleGearBoxType(),
            'VIN' => $car->vin(),
            'registration' => $car->vehicleRegistration(), 
            'production_year' => $this->faker->year,
        ];
    }
}

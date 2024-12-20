<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Rent;
use App\Models\User;
use App\Models\Car;

class RentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'regular')->get();
        $cars = Car::all();

        foreach ($users as $user) {
            foreach ($cars->random(3) as $car) {
                Rent::factory()->create([
                    'user_id' => $user->id,
                    'car_id' => $car->id,
                ]);
            }
        }
    }
}

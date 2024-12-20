<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Rent;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rents = Rent::all();
        
        foreach ($rents as $rent) {
            Review::factory()->create([
                'rent_id' => $rent->id,
            ]);
        }
    }
}

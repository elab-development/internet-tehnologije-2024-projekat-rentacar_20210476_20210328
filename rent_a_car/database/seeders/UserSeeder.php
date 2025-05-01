<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('godmode123'),
            'personal_id' => '',
            'drivers_licence' => '',
            'role' => 'admin',
        ]);

        User::factory()
        ->count(10)
        ->state([
            'role' => 'regular',
        ])
        ->create();
    }
}

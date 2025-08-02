<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarController;
use App\Http\Controllers\RentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']); 
Route::post('/login', [AuthController::class, 'login']); 
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware(['auth:sanctum'])->group(function () {
  
    Route::get('/users', [UserController::class, 'index']); 
    Route::get('/users/{id}', [UserController::class, 'show']); 

    Route::get('/rents', [RentController::class, 'index']); 
    //dodata ruta za rente korisnika
    Route::get('/myrents', [RentController::class, 'myrents']); 
    Route::delete('/rents/{id}', [RentController::class, 'destroy']); 
    Route::post('/rents', [RentController::class, 'store']); 
    Route::patch('/rents/{id}', [RentController::class, 'update']); 

    Route::post('/reviews', [ReviewController::class, 'store']); 
    Route::put('/reviews/{id}', [ReviewController::class, 'update']); 
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']); 

    // Statistika (samo admin)
    Route::get('/rents/stats', [RentController::class, 'stats']);

    Route::put('/users/{id}', [UserController::class, 'update']);
});

Route::resource('cars', CarController::class)->only(['index', 'show']);

Route::get('/reviews', [ReviewController::class, 'index']); 

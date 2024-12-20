<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RentController;

Route::post('/register', [AuthController::class, 'register']); 
Route::post('/login', [AuthController::class, 'login']); 



Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users', [UserController::class, 'index']); 
    Route::get('/users/{id}', [UserController::class, 'show']); 

    Route::get('/rents', [RentController::class, 'index']);
    Route::delete('/rents/{id}', [RentController::class, 'destroy']); 
    Route::post('/rents', [RentController::class, 'store']); 
    Route::patch('/rents/{id}', [RentController::class, 'update']); 


    Route::post('/logout', [AuthController::class, 'logout']);
});
    
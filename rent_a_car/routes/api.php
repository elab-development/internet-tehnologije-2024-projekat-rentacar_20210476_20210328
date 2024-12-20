<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']); 
Route::post('/login', [AuthController::class, 'login']); 



Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users', [UserController::class, 'index']); 
    Route::get('/users/{id}', [UserController::class, 'show']); 


    Route::post('/logout', [AuthController::class, 'logout']);
});
    
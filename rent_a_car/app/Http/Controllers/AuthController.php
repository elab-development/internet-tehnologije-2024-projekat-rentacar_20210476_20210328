<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
            'personal_id' => 'required|file|mimes:jpg,jpeg,png,pdf', 
            'drivers_licence' => 'required|file|mimes:jpg,jpeg,png,pdf', 
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        $personalIdName = Str::random(32) . "." . $request->personal_id->getClientOriginalExtension();
        $driversLicenceName = Str::random(32) . "." . $request->drivers_licence->getClientOriginalExtension();
    
        $emailPart = explode('@', $request->email)[0];
        $userFolder = "user_documents/{$emailPart}";
    
        Storage::disk('public')->put("{$userFolder}/{$personalIdName}", file_get_contents($request->file('personal_id')));
        Storage::disk('public')->put("{$userFolder}/{$driversLicenceName}", file_get_contents($request->file('drivers_licence')));
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'personal_id' => "{$userFolder}/{$personalIdName}",
            'drivers_licence' => "{$userFolder}/{$driversLicenceName}",
            'role' => 'regular',
        ]);
    
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'message' => 'Registracija novog korisnika uspesna.',
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }
    
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
            return response()->json(['error' => 'Podaci za prijavu pogresni...'], 401);
        }

        $user = Auth::user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => $user->role === 'admin' 
                ? "Administrator prijavljen: $user->email" 
                : "Prijava korisnika: $user->email uspesna!",
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        $request->user()->tokens()->delete();
        return response()->json(['message' => "Korisnik $user->email je uspešno odjavljen."], 200);
    }
}

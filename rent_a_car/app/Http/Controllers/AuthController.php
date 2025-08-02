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
        // Validacija regularnih polja
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }
    
        // Provera da li su fajlovi prisutni
        if (!$request->hasFile('personal_id') || !$request->hasFile('drivers_licence')) {
            return response()->json(['error' => 'Fajlovi nisu pravilno poslati.'], 422);
        }
    
        // Validacija fajlova
        $validator = Validator::make($request->all(), [
            'personal_id' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'drivers_licence' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }
    
        // Snimanje fajlova
        $emailPart = explode('@', $request->email)[0];
        $userFolder = "user_documents/{$emailPart}";
    
        $personalId = $request->file('personal_id'); 
        $driversLicence = $request->file('drivers_licence'); 
    
        $personalIdName = Str::random(32) . "." . $personalId->getClientOriginalExtension();
        $driversLicenceName = Str::random(32) . "." . $driversLicence->getClientOriginalExtension();
    
        $personalId->storeAs("public/{$userFolder}", $personalIdName);
        $driversLicence->storeAs("public/{$userFolder}", $driversLicenceName);
    
        // Kreiranje korisnika
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
            'message' => 'Registracija novog korisnika uspešna.',
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

       /**
     * Reset a user's password by email.
     * Accepts: email, password, password_confirmation
     */
    public function resetPassword(Request $request)
    {
        // 1) Validate
        $validator = Validator::make($request->all(), [
            'email'                 => 'required|email|exists:users,email',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8',
        ], [
            'email.required'           => 'Email je obavezan.',
            'email.email'              => 'Email nije validan.',
            'email.exists'             => 'Korisnik sa ovim mejlom ne postoji.',
            'password.required'        => 'Lozinka je obavezna.',
            'password.min'             => 'Lozinka mora imati najmanje 8 karaktera.',
            'password.confirmed'       => 'Lozinka i potvrda lozinke se ne poklapaju.',
            'password_confirmation.required' => 'Potvrda lozinke je obavezna.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2) Find user and update
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // 3) Return success
        return response()->json([
            'message' => 'Lozinka je uspešno resetovana.'
        ], 200);
    }
}

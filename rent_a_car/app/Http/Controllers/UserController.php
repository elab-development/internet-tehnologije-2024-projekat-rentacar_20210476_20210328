<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     * Only accessible by an admin.
     */
    public function index()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Neautorizovan pristup: Samo admin moze videti sve korisnike!'], 403);
        }

        $users = User::all();

        return response()->json(['users' => $users], 200);
    }

    /**
     * Display a specific user by ID.
     * Only accessible by an admin.
     */
    public function show($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Neautorizovan pristup: Samo admin moze videti podatke o korisniku!'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Korisnik ne postoji.'], 404);
        }

        return response()->json(['user' => $user], 200);
    }

     /**
     * Update a user's name or email.
     * Only accessible by an admin.
     */
    public function update(Request $request, $id)
    {
        // 1) Only admins may hit this
        if (Auth::user()->role !== 'admin') {
            return response()->json(
                ['error' => 'Neautorizovan pristup: Samo admin može menjati korisnike!'],
                403
            );
        }

        // 2) Find the user
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'Korisnik ne postoji.'], 404);
        }

        // 3) Validate only name & email
        $validated = $request->validate(
            [
                'name'  => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            ],
            [
                'name.required'  => 'Ime je obavezno.',
                'name.string'    => 'Ime mora biti tekst.',
                'name.max'       => 'Ime ne može biti duže od 255 karaktera.',
                'email.required' => 'Email je obavezan.',
                'email.email'    => 'Email mora biti validan.',
                'email.max'      => 'Email ne može biti duže od 255 karaktera.',
                'email.unique'   => 'Ovaj email je već zauzet.',
            ]
        );

        // 4) Perform the update
        $user->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
        ]);

        // 5) Return updated user
        return response()->json(
            ['message' => 'Korisnik uspešno ažuriran.', 'user' => $user],
            200
        );
    }
}


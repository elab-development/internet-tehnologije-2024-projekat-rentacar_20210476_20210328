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
}


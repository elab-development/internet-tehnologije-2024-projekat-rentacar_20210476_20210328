<?php

namespace App\Http\Controllers;

use App\Models\Rent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\RentResource;

class RentController extends Controller
{
    /**
     * Prikaz svih renti.
     * Dostupno samo adminima.
     */
    public function index()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Nemate ovlašćenje: Ova funkcija je dostupna samo administratorima!'], 403);
        }

        $rents = Rent::with(['car', 'user'])->get();

        return response()->json(['rents' => RentResource::collection($rents)], 200);
    }

    public function myrents()
{
    if (!Auth::check()) {
        return response()->json(['error' => 'Neautorizovan pristup'], 401);
    }
    $userId = Auth::id();

 
    $rents = Rent::where('user_id', $userId)
        ->with(['user', 'car']) 
        ->get();

    if ($rents->isEmpty()) {
        return response()->json(['message' => 'Nema rentanja za ovog korisnika'], 404);
    }

    return response()->json(['rents' => RentResource::collection($rents)], 200);
}


    /**
     * Brisanje odabrane rente.
     * Dostupno samo adminima.
     */
    public function destroy($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Nemate ovlašćenje: Ova funkcija je dostupna samo administratorima!'], 403);
        }

        $rent = Rent::find($id);

        if (!$rent) {
            return response()->json(['error' => 'Renta nije pronađena.'], 404);
        }

        $rent->delete();

        return response()->json(['message' => 'Renta je uspešno obrisana.'], 200);
    }

    /**
     * Kreiranje nove rente.
     * Dostupno samo regularnim korisnicima.
     */
    public function store(Request $request)
    {
        if (Auth::user()->role === 'admin') {
            return response()->json(['error' => 'Nemate ovlašćenje: Ova funkcija je dostupna samo regularnim korisnicima!'], 403);
        }

        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'rent_start_date' => 'required|date|after_or_equal:today',
            'rent_end_date' => 'required|date|after:rent_start_date',
            'total_price' => 'required|numeric|min:0',
        ], [
            'car_id.required' => 'Polje za ID vozila je obavezno.',
            'car_id.exists' => 'Izabrano vozilo ne postoji.',
            'rent_start_date.required' => 'Datum početka rente je obavezan.',
            'rent_start_date.after_or_equal' => 'Datum početka rente mora biti danas ili kasnije.',
            'rent_end_date.required' => 'Datum završetka rente je obavezan.',
            'rent_end_date.after' => 'Datum završetka rente mora biti nakon datuma početka.',
            'total_price.required' => 'Cena je obavezna.',
            'total_price.numeric' => 'Cena mora biti broj.',
            'total_price.min' => 'Cena mora biti najmanje 0.',
        ]);

        $rent = Rent::create([
            'user_id' => Auth::id(),
            'car_id' => $validated['car_id'],
            'rent_start_date' => $validated['rent_start_date'],
            'rent_end_date' => $validated['rent_end_date'],
            'total_price' => $validated['total_price'],
        ]);

        return response()->json(['message' => 'Renta je uspešno kreirana.', 'rent' => new RentResource($rent)], 201);
    }

    /**
     * Ažuriranje datuma trajanja rente.
     * Dostupno samo regularnim korisnicima.
     */
    public function update(Request $request, $id)
    {
        if (Auth::user()->role === 'admin') {
            return response()->json(['error' => 'Nemate ovlašćenje: Ova funkcija je dostupna samo regularnim korisnicima!'], 403);
        }

        $rent = Rent::find($id);

        if (!$rent) {
            return response()->json(['error' => 'Renta nije pronađena.'], 404);
        }

        if ($rent->user_id !== Auth::id()) {
            return response()->json(['error' => 'Nemate ovlašćenje: Možete ažurirati samo svoje rente.'], 403);
        }

        $validated = $request->validate([
            'rent_start_date' => 'required|date|after_or_equal:today',
            'rent_end_date' => 'required|date|after:rent_start_date',
        ], [
            'rent_start_date.required' => 'Datum početka rente je obavezan.',
            'rent_start_date.after_or_equal' => 'Datum početka rente mora biti danas ili kasnije.',
            'rent_end_date.required' => 'Datum završetka rente je obavezan.',
            'rent_end_date.after' => 'Datum završetka rente mora biti nakon datuma početka.',
        ]);

        $rent->update([
            'rent_start_date' => $validated['rent_start_date'],
            'rent_end_date' => $validated['rent_end_date'],
        ]);

        return response()->json(['message' => 'Renta je uspešno ažurirana.', 'rent' => new RentResource($rent)], 200);
    }
}

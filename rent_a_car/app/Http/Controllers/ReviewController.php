<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Http\Resources\ReviewResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Prikaz svih recenzija.
     * Dostupno svim korisnicima, uključujući neulogovane.
     */
    public function index()
    {
        $reviews = Review::with(['rent.car', 'rent.user'])->get();

        return response()->json(['reviews' => ReviewResource::collection($reviews)], 200);
    }

    /**
     * Kreiranje nove recenzije.
     * Dostupno samo autentifikovanim korisnicima.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rent_id' => 'required|exists:rents,id',
            'review' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $review = Review::create([
            'rent_id' => $validated['rent_id'],
            'review' => $validated['review'],
            'rating' => $validated['rating'],
        ]);

        return response()->json(['message' => 'Recenzija je uspešno kreirana.', 'review' => new ReviewResource($review)], 201);
    }

    /**
     * Izmena postojeće recenzije.
     * Dostupno samo korisniku koji je kreirao recenziju.
     */
    public function update(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['error' => 'Recenzija nije pronađena.'], 404);
        }

        $validated = $request->validate([
            'review' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $review->update([
            'review' => $validated['review'],
            'rating' => $validated['rating'],
        ]);

        return response()->json(['message' => 'Recenzija je uspešno ažurirana.', 'review' => new ReviewResource($review)], 200);
    }

    /**
     * Brisanje recenzije.
     * Dostupno korisniku koji je kreirao recenziju ili adminu.
     */
    public function destroy($id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['error' => 'Recenzija nije pronađena.'], 404);
        }

        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Nemate ovlašćenje za brisanje ove recenzije.'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Recenzija je uspešno obrisana.'], 200);
    }
}

import { useState, useEffect } from "react";

const GIPHY_API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

export default function useGif() {
  const [gifUrl, setGifUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGif() {
      if (!GIPHY_API_KEY) {
        setError("Nedostaje GIPHY_API_KEY");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=car&rating=g`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { data } = await res.json();
        setGifUrl(data.images?.original?.url || null);
      } catch (err) {
        setError("Greška pri učitavanju GIF-a");
      } finally {
        setLoading(false);
      }
    }
    fetchGif();
  }, []);

  return { gifUrl, loading, error };
}

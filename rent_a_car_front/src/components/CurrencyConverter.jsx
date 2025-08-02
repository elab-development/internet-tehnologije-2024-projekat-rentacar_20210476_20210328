import React, { useState, useEffect } from 'react';

// Modul-level keš i promise za jedan jedini fetch
let cachedExchangeRate = null;
let fetchPromise = null;

// Funkcija koja pokušava da dođe do kursa (primary → fallback)
async function fetchRate(apiKey) {
  const primaryUrl = `https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}&symbols=RSD`;
  try {
    const res = await fetch(primaryUrl);
    if (res.status === 429) {
      console.warn('Primary API rate limit, prebacujem se na fallback');
      const fb = await fetch('https://api.exchangerate.host/latest?base=EUR&symbols=RSD');
      const fbData = await fb.json();
      return fbData?.rates?.RSD ?? 1;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success && typeof data.rates.RSD === 'number'
      ? data.rates.RSD
      : 1;
  } catch (err) {
    console.error('Greška pri fetch-u primary API-ja:', err);
    // fallback
    try {
      const fb = await fetch('https://api.exchangerate.host/latest?base=EUR&symbols=RSD');
      const fbData = await fb.json();
      return fbData?.rates?.RSD ?? 1;
    } catch {
      return 1;
    }
  }
}

// Vraća promise koji kešira rezultat
function getExchangeRateAsync() {
  if (cachedExchangeRate != null) {
    return Promise.resolve(cachedExchangeRate);
  }
  if (!fetchPromise) {
    const apiKey = process.env.REACT_APP_API_KEY;
    if (!apiKey) {
      console.error('REACT_APP_API_KEY nije postavljen u .env');
      cachedExchangeRate = 1;
      fetchPromise = Promise.resolve(1);
    } else {
      fetchPromise = fetchRate(apiKey).then(rate => {
        cachedExchangeRate = rate;
        return rate;
      });
    }
  }
  return fetchPromise;
}

const CurrencyConverter = ({ priceInEUR }) => {
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState('EUR');
  const [convertedPrice, setConvertedPrice] = useState(priceInEUR);

  useEffect(() => {
    // Jednom po mountu, povuci (ili iz keša) kurs
    getExchangeRateAsync().then(rate => {
      setExchangeRate(rate);
    });
  }, []);

  useEffect(() => {
    setConvertedPrice(
      currency === 'EUR' ? priceInEUR : Number(priceInEUR) * exchangeRate
    );
  }, [currency, exchangeRate, priceInEUR]);

  const formatPrice = val => {
    const n = Number(val);
    return isNaN(n) ? '-' : n.toFixed(2);
  };

  return (
    <div>
      <span>
        {formatPrice(currency === 'EUR' ? priceInEUR : convertedPrice)} {currency}
      </span>
      <select value={currency} onChange={e => setCurrency(e.target.value)}>
        <option value="EUR">EUR</option>
        <option value="RSD">RSD</option>
      </select>
    </div>
  );
};

export default CurrencyConverter;

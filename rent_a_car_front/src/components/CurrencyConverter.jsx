import React, { useState, useEffect } from 'react';

const CurrencyConverter = ({ priceInEUR }) => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currency, setCurrency] = useState('EUR');
  const [convertedPrice, setConvertedPrice] = useState(priceInEUR);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const apiKey = process.env.REACT_APP_API_KEY;  
        const response = await fetch(`https://api.exchangeratesapi.io/latest?base=EUR&access_key=${apiKey}`);
        const data = await response.json();
        setExchangeRate(data.rates.RSD);  
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };
    
    fetchExchangeRate();
  }, []);

  useEffect(() => {
    if (currency === 'EUR') {
      setConvertedPrice(priceInEUR);  
    } else if (currency === 'RSD' && exchangeRate) {
      // If currency is RSD, convert to RSD
      setConvertedPrice(Number(priceInEUR) * exchangeRate);  
    }
  }, [currency, exchangeRate, priceInEUR]);

  const formatPrice = (price) => {
    const validPrice = Number(price); 
    if (isNaN(validPrice)) return '-';  
    return validPrice.toFixed(2);  
  };

  return (
    <div>
      <span>{currency === 'EUR' ? formatPrice(priceInEUR) : formatPrice(convertedPrice)} {currency}</span>
      <select onChange={(e) => setCurrency(e.target.value)} value={currency}>
        <option value="EUR">EUR</option>
        <option value="RSD">RSD</option>
      </select>
    </div>
  );
};

export default CurrencyConverter;

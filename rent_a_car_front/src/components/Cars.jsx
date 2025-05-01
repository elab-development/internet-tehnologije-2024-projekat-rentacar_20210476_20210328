import React, { useState, useEffect } from "react";
import Button from "./Button";
import Footer from "./Footer";
import CurrencyConverter from "./CurrencyConverter"; 
import { Link } from "react-router-dom";
import useSearch from "../hooks/useSearch";  // Importujemo custom hook za pretragu

const Cars = () => {
  const [cars, setCars] = useState([]); // State za čuvanje liste automobila
  const [error, setError] = useState(null); // State za greške prilikom učitavanja
  const [currentPage, setCurrentPage] = useState(1); // Trenutna stranica paginacije
  const [carsPerPage] = useState(6); // Broj automobila po stranici

  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Poziv API-ja za dobijanje liste automobila
        const response = await fetch("http://127.0.0.1:8000/api/cars", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (response.ok && data.cars) {
          setCars(data.cars); // Postavljamo podatke u state ako je odgovor validan
        } else {
          setError(data.error || "Greška pri učitavanju automobila."); // Postavljamo grešku ako je došlo do problema
        }
      } catch (error) {
        setError("Došlo je do greške."); // Postavljamo generičku grešku ako API poziv ne uspe
      }
    };

    fetchCars();
  }, []);

  // Koristimo hook za pretragu automobila po nazivu
  const { query, filteredData, handleSearchChange } = useSearch(cars);

  // Računanje paginacije
  const indexOfLastCar = currentPage * carsPerPage; // Indeks poslednjeg automobila na trenutnoj stranici
  const indexOfFirstCar = indexOfLastCar - carsPerPage; // Indeks prvog automobila na trenutnoj stranici
  const currentCars = filteredData.slice(indexOfFirstCar, indexOfLastCar); // Automobili koji se prikazuju na trenutnoj stranici

  const totalPages = Math.ceil(filteredData.length / carsPerPage); // Ukupan broj stranica

  // Funkcija za menjanje stranice
  const paginate = (newPage) => {
    if (newPage < 1) {
      setCurrentPage(1); // Sprečavamo odlazak na stranicu ispod 1
    } else if (newPage > totalPages) {
      setCurrentPage(totalPages); // Sprečavamo odlazak na stranicu iznad maksimalnog broja stranica
    } else {
      setCurrentPage(newPage); // Postavljamo novu stranicu
    }
  };

  return (
    <>
      <div className="cars-container">
        <h1>Svi Automobili</h1>
        <p>Ovde su prikazani svi automobili koji su dostupni za rentanje.</p>
        <div>
          <Link to="/home">Početna</Link> &gt; <span>Automobili</span>
        </div>

        {/* Polje za pretragu automobila */}
        <input
          type="text"
          placeholder="Pretraži automobile..."
          value={query}
          onChange={handleSearchChange}
          className="search-input"
        />

        {error && <p>{error}</p>} {/* Prikaz greške ako postoji */}

        <div className="cars-grid">
          {currentCars.length > 0 ? (
            currentCars.map((car) => (
              <div key={car.id} className="car-card">
                <h3>{car.car_name}</h3>
                <p>Vrsta goriva: {car.fuel_type}</p>
                <CurrencyConverter priceInEUR={car.price_per_day} />
                <p>Godina proizvodnje: {car.production_year}</p>
                <Button
                  text="Rentiraj"
                  onClick={() => alert("Nema funkcionalnosti za rentanje još")}
                />
              </div>
            ))
          ) : (
            <p>Nema rezultata pretrage.</p> // Prikaz poruke ako nema rezultata pretrage
          )}
        </div>

        {/* Paginacija */}
        <div className="pagination">
          <Button
            text="Prethodna"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1} // Onemogućavamo dugme ako smo na prvoj stranici
          />
          <span>Strana {currentPage} od {totalPages}</span>
          <Button
            text="Sledeća"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages} // Onemogućavamo dugme ako smo na poslednjoj stranici
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cars;

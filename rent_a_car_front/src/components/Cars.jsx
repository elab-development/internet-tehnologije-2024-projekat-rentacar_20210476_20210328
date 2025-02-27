import React, { useState, useEffect } from "react";
import Button from "./Button";
import Footer from "./Footer";
import CurrencyConverter from "./CurrencyConverter"; 

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(6);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/cars", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (response.ok && data.cars) {
          setCars(data.cars);
        } else {
          setError(data.error || "Greška pri učitavanju automobila.");
        }
      } catch (error) {
        setError("Došlo je do greške.");
      }
    };

    fetchCars();
  }, []);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  const paginate = (newPage) => {
    if (newPage < 1) {
      setCurrentPage(1);
    } else if (newPage > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(cars.length / carsPerPage);

  return (
    <>
      <div className="cars-container">
        <h1>Svi Automobili</h1>
        <p>Ovde su prikazani svi automobili koji su dostupni za rentanje.</p>
        
        {error && <p>{error}</p>}
        
        <div className="cars-grid">
          {currentCars.map((car) => (
            <div key={car.id} className="car-card">
              <h3>{car.car_name}</h3>
              <p>Vrsta goriva: {car.fuel_type}</p>
              <CurrencyConverter priceInEUR={car.price_per_day} />
              <p>Godina proizvodnje: {car.production_year}</p>
              <Button text="Rentiraj" onClick={() => alert("Nema funkcionalnosti za rentanje još")} />
            </div>
          ))}
        </div>

        {/* Paginacija */}
        <div className="pagination">
          <Button
            text="Prethodna"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          />
          <span>Strana {currentPage} od {totalPages}</span>
          <Button
            text="Sledeća"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cars;

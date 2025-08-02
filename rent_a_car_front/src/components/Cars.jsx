// src/components/Cars.jsx

import React, { useState, useEffect, useMemo } from "react";
import Button from "./Button";
import Footer from "./Footer";
import CurrencyConverter from "./CurrencyConverter";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import useSearch from "../hooks/useSearch";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(6);

  // filter & sort state
  const [fuelFilter, setFuelFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  // Modal rentiranja
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [rentStartDate, setRentStartDate] = useState("");
  const [rentEndDate, setRentEndDate] = useState("");
  const [rentErrors, setRentErrors] = useState({});

  // load cars
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/cars`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const data = await res.json();
        if (res.ok && data.cars) setCars(data.cars);
        else setError(data.error || "Greška pri učitavanju automobila.");
      } catch {
        setError("Došlo je do greške.");
      }
    })();
  }, []);

  // search hook
  const { query, filteredData: searchedCars, handleSearchChange } = useSearch(cars);

  // derive unique fuel types for filter dropdown
  const fuelTypes = useMemo(() => {
    const types = Array.from(new Set(cars.map((c) => c.fuel_type)));
    return ["All", ...types];
  }, [cars]);

  // apply fuel filter
  const fuelFiltered = useMemo(() => {
    if (fuelFilter === "All") return searchedCars;
    return searchedCars.filter((c) => c.fuel_type === fuelFilter);
  }, [searchedCars, fuelFilter]);

  // apply sort
  const sorted = useMemo(() => {
    return [...fuelFiltered].sort((a, b) => {
      return sortOrder === "asc"
        ? a.price_per_day - b.price_per_day
        : b.price_per_day - a.price_per_day;
    });
  }, [fuelFiltered, sortOrder]);

  // pagination
  const totalPages = Math.ceil(sorted.length / carsPerPage);
  const currentCars = useMemo(() => {
    const start = (currentPage - 1) * carsPerPage;
    return sorted.slice(start, start + carsPerPage);
  }, [sorted, currentPage, carsPerPage]);

  const paginate = (n) => setCurrentPage(Math.min(Math.max(n, 1), totalPages));

  // rent modal handlers
  const openRentModal = (car) => {
    setSelectedCar(car);
    setRentStartDate("");
    setRentEndDate("");
    setRentErrors({});
    setShowModal(true);
  };
  const closeRentModal = () => setShowModal(false);

  // submit rent
  const handleRentSubmit = async () => {
    const token = sessionStorage.getItem("userToken");
    if (!token) return alert("Morate biti prijavljeni da biste rentirali.");

    try {
      const res = await fetch(`${API_BASE}/rents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          car_id: selectedCar.id,
          rent_start_date: rentStartDate,
          rent_end_date: rentEndDate,
        }),
      });
      const text = await res.text();
      console.log("🔴 raw response text:\n", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (res.status === 422 && data.errors) {
        setRentErrors(data.errors);
        return;
      }

      if (!res.ok) {
        return alert(
          `Server je odgovorio statusom ${res.status}:\n\n` +
          (typeof data === "string" ? data : JSON.stringify(data, null, 2))
        );
      }

      alert("Uspešno ste rezervisali automobil!");
      closeRentModal();
    } catch (err) {
      alert("Greška pri komunikaciji sa serverom: " + err.message);
    }
  };

  return (
    <>
      <div className="cars-container">
        <h1>Svi Automobili</h1>
        <p>Ovde su prikazani svi automobili koji su dostupni za rentanje.</p>
        <div className="breadcrumb">
          <Link to="/home">Početna</Link> &gt; <span>Automobili</span>
        </div>

        {/* controls: search, filter, sort */}
        <div className="cars-controls">
          <input
            type="text"
            placeholder="Pretraži automobile..."
            value={query}
            onChange={handleSearchChange}
            className="search-input"
          />

          <select
            style={{ width: "200px" }}
            value={fuelFilter}
            onChange={(e) => {
              setFuelFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            {fuelTypes.map((ft) => (
              <option key={ft} value={ft}>
                {ft === "All" ? "Sve vrste goriva" : ft}
              </option>
            ))}
          </select>

          <select
          style={{ width: "200px" }}
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="asc">Cena rastuće</option>
            <option value="desc">Cena opadajuće</option>
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="cars-grid">
          {currentCars.length ? (
            currentCars.map((car) => (
              <div key={car.id} className="car-card">
                <h3>{car.car_name}</h3>
                <p>Vrsta goriva: {car.fuel_type}</p>
                <CurrencyConverter priceInEUR={car.price_per_day} />
                <p>Godina proizvodnje: {car.production_year}</p>
                <Button text="Rentiraj" onClick={() => openRentModal(car)} />
              </div>
            ))
          ) : (
            <p className="no-results">Nema rezultata pretrage.</p>
          )}
        </div>

        <div className="pagination">
          <Button
            text="Prethodna"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          />
          <span>
            Strana {currentPage} od {totalPages}
          </span>
          <Button
            text="Sledeća"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </div>
      </div>

      {showModal && (
        <Modal onClose={closeRentModal}>
          <div className="rent-modal-content">
            <h2>Rentiraj: {selectedCar.car_name}</h2>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="rentStart">Datum početka:</label>
                <input
                  type="date"
                  id="rentStart"
                  value={rentStartDate}
                  onChange={(e) => setRentStartDate(e.target.value)}
                />
                {rentErrors.rent_start_date && (
                  <p className="field-error">
                    {rentErrors.rent_start_date[0]}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="rentEnd">Datum završetka:</label>
                <input
                  type="date"
                  id="rentEnd"
                  value={rentEndDate}
                  onChange={(e) => setRentEndDate(e.target.value)}
                />
                {rentErrors.rent_end_date && (
                  <p className="field-error">
                    {rentErrors.rent_end_date[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="modal-buttons">
              <Button text="Potvrdi" onClick={handleRentSubmit} />
              <Button text="Otkaži" onClick={closeRentModal} />
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </>
  );
};

export default Cars;

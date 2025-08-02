// src/components/Cars.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Footer from "./Footer";
import CurrencyConverter from "./CurrencyConverter";
import Modal from "./Modal";
import useSearch from "../hooks/useSearch";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

export default function Cars() {
  // --- Cars list + reviews store ---
  const [cars, setCars] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [error, setError] = useState(null);

  // --- Pagination, filter & sort ---
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;
  const [fuelFilter, setFuelFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  // --- Rent modal state ---
  const [showRentModal, setShowRentModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [rentStartDate, setRentStartDate] = useState("");
  const [rentEndDate, setRentEndDate] = useState("");
  const [rentErrors, setRentErrors] = useState({});

  // --- Reviews modal state ---
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedCarReviews, setSelectedCarReviews] = useState([]);
  const [selectedCarForReviews, setSelectedCarForReviews] = useState(null);

  // --- Load cars on mount ---
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/cars`);
        const data = await res.json();
        if (res.ok && data.cars) setCars(data.cars);
        else setError(data.error || "Greška pri učitavanju automobila.");
      } catch {
        setError("Greška pri komunikaciji.");
      }
    })();
  }, []);

  // --- Load all reviews on mount ---
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/reviews`);
        const data = await res.json();
        if (res.ok && data.reviews) setAllReviews(data.reviews);
      } catch {
        // ignore
      }
    })();
  }, []);

  // --- Search hook ---
  const { query, filteredData: searchedCars, handleSearchChange } =
    useSearch(cars);

  // --- Unique fuel types for filter dropdown ---
  const fuelTypes = useMemo(() => {
    const types = Array.from(new Set(cars.map((c) => c.fuel_type)));
    return ["All", ...types];
  }, [cars]);

  // --- Apply fuel filter ---
  const fuelFiltered = useMemo(() => {
    if (fuelFilter === "All") return searchedCars;
    return searchedCars.filter((c) => c.fuel_type === fuelFilter);
  }, [searchedCars, fuelFilter]);

  // --- Apply sort by price_per_day ---
  const sortedCars = useMemo(() => {
    return [...fuelFiltered].sort((a, b) =>
      sortOrder === "asc"
        ? a.price_per_day - b.price_per_day
        : b.price_per_day - a.price_per_day
    );
  }, [fuelFiltered, sortOrder]);

  // --- Paginate ---
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);
  const currentCars = useMemo(() => {
    const start = (currentPage - 1) * carsPerPage;
    return sortedCars.slice(start, start + carsPerPage);
  }, [sortedCars, currentPage]);

  const paginate = (n) => {
    setCurrentPage(Math.min(Math.max(n, 1), totalPages));
  };

  // --- Rent modal handlers ---
  const openRentModal = (car) => {
    setSelectedCar(car);
    setRentStartDate("");
    setRentEndDate("");
    setRentErrors({});
    setShowRentModal(true);
  };
  const closeRentModal = () => setShowRentModal(false);

  const handleRentSubmit = async () => {
    const token = sessionStorage.getItem("userToken");
    if (!token) return alert("Morate biti prijavljeni.");

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
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      if (res.status === 422 && data.errors) {
        setRentErrors(data.errors);
        return;
      }
      if (!res.ok) {
        alert(
          `Server status: ${res.status}\n` +
          (typeof data === "string" ? data : JSON.stringify(data, null, 2))
        );
        return;
      }
      alert("Automobil uspešno rentiran!");
      closeRentModal();
    } catch (err) {
      alert("Greška: " + err.message);
    }
  };

  // --- Reviews modal handlers ---
  const openReviewsModal = (car) => {
    const related = allReviews.filter((r) => r.rent.car.id === car.id);
    setSelectedCarReviews(related);
    setSelectedCarForReviews(car);
    setShowReviewsModal(true);
  };
  const closeReviewsModal = () => setShowReviewsModal(false);

  // --- Render ---
  return (
    <>
      <div className="cars-container">
        <h1>Svi Automobili</h1>
        <p>Ovde su prikazani svi automobili koji su dostupni za rentanje.</p>
        <div className="breadcrumb">
          <Link to="/home">Početna</Link> &gt; <span>Automobili</span>
        </div>

        {/* Search / Filter / Sort controls */}
        <div className="cars-controls">
          <input
            type="text"
            placeholder="Pretraži automobile..."
            value={query}
            onChange={handleSearchChange}
            className="search-input"
          />
          <select
            style={{ width: "250px" }}
            className="filter-select"
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
          style={{ width: "250px" }}
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

        {/* Cars grid */}
        <div className="cars-grid">
          {currentCars.length ? (
            currentCars.map((car) => (
              <div key={car.id} className="car-card">
                <h3>{car.car_name}</h3>
                <p>Vrsta goriva: {car.fuel_type}</p>
                <CurrencyConverter priceInEUR={car.price_per_day} />
                <p>Godina proizvodnje: {car.production_year}</p>

                <Button text="Rentiraj" onClick={() => openRentModal(car)} />
                <Button
                  text="Pogledaj ocene"
                  onClick={() => openReviewsModal(car)}
                />
              </div>
            ))
          ) : (
            <p className="no-results">Nema rezultata pretrage.</p>
          )}
        </div>

        {/* Pagination */}
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

      {/* Rent Modal */}
      {showRentModal && (
        <Modal onClose={closeRentModal}>
          <div className="rent-modal-content">
            <h2>Rentiraj: {selectedCar.car_name}</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Datum početka:</label>
                <input
                  type="date"
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
                <label>Datum završetka:</label>
                <input
                  type="date"
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

      {/* Reviews Modal */}
      {showReviewsModal && (
        <Modal onClose={closeReviewsModal}>
          <div className="reviews-modal">
            <h2>Ocene za: {selectedCarForReviews.car_name}</h2>
            <div className="reviews-list">
              {selectedCarReviews.length ? (
                selectedCarReviews.map((rv) => (
                  <div key={rv.id} className="review-item">
                    <p className="reviewer">
                      <strong>{rv.rent.user.name}</strong>
                    </p>
                    <div className="rating-display">
                      {[1,2,3,4,5].map((n) => (
                        <span
                          key={n}
                          className={`star display ${
                            rv.rating >= n ? "selected" : ""
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="review-text">{rv.review}</p>
                  </div>
                ))
              ) : (
                <p>Nema ocena za ovaj auto.</p>
              )}
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </>
  );
}

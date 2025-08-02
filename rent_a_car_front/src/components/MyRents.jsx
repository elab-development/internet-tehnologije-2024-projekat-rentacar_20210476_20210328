// src/components/MyRents.jsx

import React, { useState, useEffect } from "react";
import Table from "./Table";
import Button from "./Button";
import Modal from "./Modal";
import { Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const MyRents = () => {
  const [rents, setRents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);
  const [newRentDate, setNewRentDate] = useState("");
  const [newRentEndDate, setNewRentEndDate] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    const role = sessionStorage.getItem("userRole");

    if (!token || role === "admin") {
      setError("Neautorizovan pristup.");
      setIsLoading(false);
      return;
    }

    const fetchRents = async () => {
      try {
        const res = await fetch(`${API_BASE}/myrents`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Ako ruta ne postoji, tretiraj kao prazan niz
        if (res.status === 404) {
          setRents([]);
          return;
        }

        const data = await res.json();
        if (res.ok && data.rents) {
          setRents(data.rents);
        } else {
          setError(data.error || "Greška pri učitavanju renti.");
        }
      } catch {
        setError("Došlo je do greške.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRents();
  }, []);

  const handleUpdateRentDate = async () => {
    const token = sessionStorage.getItem("userToken");
    try {
      const res = await fetch(`${API_BASE}/rents/${selectedRent.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rent_start_date: newRentDate,
          rent_end_date: newRentEndDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRents((prev) =>
        prev.map((r) =>
          r.id === selectedRent.id
            ? { ...r, rent_start_date: newRentDate, rent_end_date: newRentEndDate }
            : r
        )
      );
      alert("Renta uspešno ažurirana.");
      setShowModal(false);
    } catch {
      alert(
        "Datum početka rente mora biti danas ili kasnije, a datum završetka nakon datuma početka."
      );
    }
  };

  const openModal = (rent) => {
    setSelectedRent(rent);
    setNewRentDate(rent.rent_start_date);
    setNewRentEndDate(rent.rent_end_date);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  if (error) return <p className="error-message">{error}</p>;
  if (isLoading) return <p className="loading-message">Učitavanje rentiranja...</p>;

  if (!rents.length) {
    return (
      <div className="no-rents">
        <div className="message-card">
          <p>Trenutno nemate dostupnih rentiranja...</p>
          <Link to="/cars" className="offer-link">
            Pogledajte ponudu!
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-rents-container">
      <h1>Moje Rente</h1>
      <h3>Ovde su prikazana sva moja rentiranja, sa datumima, cenama i mogućnostima ažuriranja</h3>
      <div>
        <Link to="/home">Početna</Link> &gt; <span>Moje rente</span>
      </div>

      <Table
        columns={[
          "name",
          "car_name",
          "rent_start_date",
          "rent_end_date",
          "total_price",
          "action",
        ]}
        data={rents.map((rent) => ({
          ...rent,
          name: rent.user.name,
          car_name: rent.car.car_name,
          rent_start_date: rent.rent_start_date,
          rent_end_date: rent.rent_end_date,
          total_price: rent.total_price,
          action: <Button text="Ažuriraj datum" onClick={() => openModal(rent)} />,
        }))}
      />

      {showModal && (
        <Modal onClose={closeModal}>
          <h3>Ažuriraj datum rente</h3>
          <label htmlFor="newRentDate">Novi datum početka rente:</label>
          <input
            id="newRentDate"
            type="date"
            value={newRentDate}
            onChange={(e) => setNewRentDate(e.target.value)}
          />
          <label htmlFor="newRentEndDate">Novi datum završetka rente:</label>
          <input
            id="newRentEndDate"
            type="date"
            value={newRentEndDate}
            onChange={(e) => setNewRentEndDate(e.target.value)}
          />
          <Button text="Sačuvaj promene" onClick={handleUpdateRentDate} />
          <Button text="Zatvori" onClick={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default MyRents;

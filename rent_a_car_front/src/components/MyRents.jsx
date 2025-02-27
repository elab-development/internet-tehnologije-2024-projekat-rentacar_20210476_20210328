import React, { useState, useEffect } from "react";
import Table from "./Table";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";  
import { Link } from "react-router-dom";

const MyRents = ({ userData }) => {
  const [rents, setRents] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);
  const [newRentDate, setNewRentDate] = useState("");
  const [newRentEndDate, setNewRentEndDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!userData.token || userData.role === "admin") {
      setError("Neautorizovan pristup.");
      return;
    }

    const fetchRents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/myrents", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.rents) {
          setRents(data.rents);
        } else {
          setError(data.error || "Greška pri učitavanju renti.");
        }
      } catch (error) {
        setError("Došlo je do greške.");
      }
    };

    fetchRents();
  }, [userData.token, userData.role]);

  const handleUpdateRentDate = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/rents/${selectedRent.id}`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          rent_start_date: newRentDate,
          rent_end_date: newRentEndDate,
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Došlo je do greške pri ažuriranju rente.");
      }
  
      setRents((prevRents) =>
      prevRents.map((rent) =>
        rent.id === selectedRent.id
          ? { ...rent, rent_start_date: newRentDate, rent_end_date: newRentEndDate } 
          : rent
      )
    );
      alert("Renta uspešno ažurirana.");
      setShowModal(false); 

    } catch (error) {
        alert("Datum početka rente mora biti danas ili kasnije, a datum zavrsetka nakon datuma pocetka.");
    }
  };

  const handleOpenModal = (rent) => {
    setSelectedRent(rent);
    setNewRentDate(rent.rent_start_date);
    setNewRentEndDate(rent.rent_end_date);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!rents || rents.length === 0) {
    return <p>Loading rents...</p>;
  }

  return (
    <div className="my-rents-container">
      <h1>Moje Rente</h1>
      <h3>Ovde su prikazana sva moja rentiranja, sa datumima, cenama i mogućnostima ažuriranja</h3>
      <div>
        <Link to="/home">Pocetna</Link> &gt; <span>Moje rente</span>
      </div>

      <Table
        columns={["name", "car_name", "rent_start_date", "rent_end_date", "total_price", "action"]}
        data={rents.map((rent) => ({
          ...rent,
          name: rent.user.name,
          car_name: rent.car.car_name,
          rent_start_date: rent.rent_start_date,
          rent_end_date: rent.rent_end_date,
          total_price: rent.total_price,
          action: (
            <>
              <Button text="Ažuriraj datum" onClick={() => handleOpenModal(rent)} />
            </>
          ),
        }))}
      />

{showModal && (
        <Modal onClose={handleCloseModal}>
          <h3>Ažuriraj datum rente</h3>
          <label for="newRentDate">Novi datum početka rente:</label>
          <input
            type="date"
            id="newRentDate"
            value={newRentDate}
            onChange={(e) => setNewRentDate(e.target.value)}
          />
          <label for="newRentEndDate">Novi datum završetka rente:</label>
          <input
            type="date"
            id="newRentEndDate"
            value={newRentEndDate}
            onChange={(e) => setNewRentEndDate(e.target.value)}
          />
          <Button text="Sacuvaj promene" onClick={handleUpdateRentDate} />
          <Button text="Zatvori" onClick={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default MyRents;

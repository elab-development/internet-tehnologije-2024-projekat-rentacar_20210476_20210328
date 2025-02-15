import React, { useState, useEffect } from "react";
import Table from "./Table";
import Button from "./Button";
import { Link } from "react-router-dom";

const AllRents = ({ userData }) => {
  const [rents, setRents] = useState([]);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rentsPerPage] = useState(5); 

  useEffect(() => {
    if (!userData.token || userData.role !== "admin") {
      setError("Neautorizovan pristup.");
      return;
    }

    const fetchRents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/rents", {
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

  const handleDeleteRent = async (rentId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/rents/${rentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setRents(rents.filter((rent) => rent.id !== rentId));
        alert("Renta uspešno obrisana!"); 
      } else {
        setError(data.error || "Greška pri brisanju rente.");
      }
    } catch (error) {
      setError("Došlo je do greške.");
    }
  };

  // Logika za paginaciju
  const indexOfLastRent = currentPage * rentsPerPage;
  const indexOfFirstRent = indexOfLastRent - rentsPerPage;
  const currentRents = rents.slice(indexOfFirstRent, indexOfLastRent);

  // Promena stranice
  const paginate = (newPage) => {
  if (newPage < 1) {
    setCurrentPage(1);
  } else if (newPage > totalPages) {
    setCurrentPage(totalPages);
  } else {
    setCurrentPage(newPage);
  }
};

  if (error) {
    return <p>{error}</p>;
  }

  if (!rents || rents.length === 0) {
    return <p>Loading rents...</p>;
  }

  // Ukupan broj strama
  const totalPages = Math.ceil(rents.length / rentsPerPage);

  return (
    <div className="all-rents-container">
      <h1>Sve Rente</h1>
      <h3> Ovde su prikazana sva rentiranja u prethodnom periodu od korisnika sajta, kao i cene</h3>
      <div>
        <Link to="/dashboard">Administrativni Panel</Link> &gt; <span>All Rents</span>
      </div>
      
      <Table
        columns={["name", "car_name", "rent_start_date", "rent_end_date", "total_price", "action"]}
        data={currentRents.map((rent) => ({
          ...rent,
          name: rent.user.name,
          car_name: rent.car.car_name,
          rent_start_date: rent.rent_start_date,
          rent_end_date: rent.rent_end_date,
          total_price: rent.total_price,
          action: (
            <Button text="Obriši" onClick={() => handleDeleteRent(rent.id)} />
          ),
        }))}
      />

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
  );
};

export default AllRents;

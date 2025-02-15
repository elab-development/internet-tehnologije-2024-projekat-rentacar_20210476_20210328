import React, { useState, useEffect } from "react";
import Table from "./Table";

const UsersDashboard = ({ userData }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Provera da li je korisnik ulogovan
    if (!userData.token) {
      setError("Neautorizovan pristup.");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userData.token}`, // Proveravamo token
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
        } else {
          setError(data.error || "Greška pri učitavanju korisnika");
        }
      } catch (error) {
        setError("Došlo je do greške.");
      }
    };

    fetchUsers();
  }, [userData.token]);

  return (
    <div className="users-container">
      <h1>Svi Korisnici</h1>
      <h3> Ovde se moze videti spisak svih korisnika koji koriste ovu aplikaciju </h3>
      {error && <p className="error-message">{error}</p>}
      <Table
        columns={["name", "email", "role"]}
        data={users}
      />
    </div>
  );
};

export default UsersDashboard;

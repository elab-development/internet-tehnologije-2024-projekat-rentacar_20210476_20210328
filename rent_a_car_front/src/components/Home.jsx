import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Home = () => {
  const navigate = useNavigate();

  // Učitavanje podataka korisnika iz sessionStorage-a
  const userId = sessionStorage.getItem("userId");
  const userRole = sessionStorage.getItem("userRole");
  const userToken = sessionStorage.getItem("userToken");

  // Ako korisnik nije prijavljen, preusmeravamo ga na login
  if (!userId || !userRole || !userToken) {
    navigate("/login");
    return null;
  }

  // Logout funkcija - briše sessionStorage i preusmerava na login
  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userToken");

    alert("Uspešno ste se odjavili.");
    navigate("/");
  };

  return (
    <div className="home-container">
      <h2>Dobrodošli!</h2>
      <p><strong>ID:</strong> {userId}</p>
      <p><strong>Uloga:</strong> {userRole}</p>
      <p><strong>Token:</strong> {userToken}</p>

      <Button text="Odjava" onClick={handleLogout} />
    </div>
  );
};

export default Home;

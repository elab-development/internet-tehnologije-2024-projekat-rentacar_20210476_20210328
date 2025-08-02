import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import logo from "../images/logo.png";

const Navigation = ({ userData, handleLogout }) => {
  return (
    <nav className="navigation">
      <div className="logo">
        <img src={logo} alt="Rent a Car Logo" />
        <h1>Rent a Car</h1>
      </div>
      <ul className="nav-links">
        {userData.role === "admin" ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/users">Korisnici</Link></li>
            <li><Link to="/rents">Rentiranja</Link></li>
          </>
        ) : userData.role === "regular" ? (
          <>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/myrents">Moja Rentiranja</Link></li>
            <li><Link to="/cars">Auta za Rentiranje</Link></li>
             <li><Link to="/reviews">Pregled ocena</Link></li>
          </>
        ) : null}
      </ul>
      <div className="user-info">
        {userData.name && <span>Zdravo, {userData.name}!</span>}
        {userData.token && <Button text="Odjavi se" onClick={handleLogout} />}
      </div>
    </nav>
  );
};

export default Navigation;

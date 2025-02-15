import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Footer from "./Footer";

const Dashboard = ({ userData }) => {
  const navigate = useNavigate();

  const navigateToUsers = () => {
    navigate("/users");
  };

  const navigateToRents = () => {
    navigate("/rents");
  };

  return (
    <div className="home-page">
        <div className="header"> 
            <h1>Zdravo, {userData.name}!</h1>
            <div className="about-content">
                <h2>Administratorski Panel</h2>
                <p>
                    Dobrodošli u administratorski panel. Ovde možete pratiti korisnike i rentiranja.
                </p>
            </div>
        </div>

        <section className="cards">
            <div className="card">
                <h3>Korisnici</h3>
                <p>Pogledajte sve korisnike na sajtu.</p>
                <Button text="Pogledaj korisnike" onClick={navigateToUsers} />
            </div>
            <div className="card">
                <h3>Rentiranja</h3>
                <p>Pogledajte sav promet rentiranja.</p>
                <Button text="Pogledaj rentiranja" onClick={navigateToRents} />
            </div>
        </section>

        <Footer />
    </div>
  );
};

export default Dashboard;

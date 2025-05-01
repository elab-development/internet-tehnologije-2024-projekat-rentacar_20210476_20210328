import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Footer from "./Footer";

const Home = ({ userData }) => {
  const navigate = useNavigate();

  const navigateToMyRents = () => {
    navigate("/myrents");
  };

  const navigateToCars = () => {
    navigate("/cars");
  };


  return (
    <div className="home-page">
        <div className="header"> 
            <h1>Zdravo {userData.name}!</h1>
            <div className="about-content">
                <h2>O Rent a Car Aplikaciji</h2>
                <p>
                    Rent a Car je usluga koja omogućava jednostavno i brzo iznajmljivanje
                    automobila. Bez obzira na to da li vam treba auto na par dana ili
                    duže, mi imamo rešenje za vas. Naša ponuda uključuje različite
                    modele automobila, od malih ekoloških vozila do luksuznih automobila.
                </p>
            </div>
        </div>
       
      <section className="cards">
        <div className="card">
          <h3>Moja Rentiranja</h3>
          <p>Pogledajte svoja prethodna i aktuelna rentiranja.</p>
          <Button text="Pogledaj rentiranja" onClick={navigateToMyRents} />
        </div>
        <div className="card">
          <h3>Ponuda Automobila</h3>
          <p>Pogledajte sve automobile koje možete iznajmiti.</p>
          <Button text="Pogledaj ponudu" onClick={navigateToCars} />
        </div>
      </section>

    

      <Footer />
    </div>
  );
};

export default Home;

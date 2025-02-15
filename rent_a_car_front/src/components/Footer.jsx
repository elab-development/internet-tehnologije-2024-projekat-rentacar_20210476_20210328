import React from "react";
import logo from "../images/logo.png"; 

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Rent a Car Logo" />
          <h2>Rent a Car</h2>
        </div>
        
        <div className="footer-email">
          <p>Email: <a href="mailto:info@rentacar.com">info@rentacar.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

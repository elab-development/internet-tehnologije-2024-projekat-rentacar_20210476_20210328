import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";


const Login = ({ setUserData }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Neuspešna prijava.");
      }

      // Ekstrakcija podataka iz odgovora
      const { id, role } = data.user;
      const { token } = data;

      // Čuvamo podatke u sessionStorage
      sessionStorage.setItem("userId", id);
      sessionStorage.setItem("userRole", role);
      sessionStorage.setItem("userToken", token);

      // Prosleđujemo podatke u App.js
      setUserData({ id, role, token });

      alert("Uspešno ste prijavljeni!");
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
        <div className="login-title">
            <h1>Rent a Car</h1>
            <p>Dobrodošli! Prijavite se i iznajmite automobil brzo i lako.</p>
      </div>
  
      <div className="login-container">
        <h2>Prijava</h2>
        {error && <p className="error-message">{error}</p>}
  
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="form-group">
            <label>Lozinka</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
  
          <Button text="Prijavi se" type="submit" />
        </form>
  
        <p className="register-text">
          Nemate nalog? Registrujte se klikom na dugme ispod:
        </p>
        <Button text="Registracija" onClick={() => navigate("/register")} />
      </div>
    </div>
  );
}

export default Login;


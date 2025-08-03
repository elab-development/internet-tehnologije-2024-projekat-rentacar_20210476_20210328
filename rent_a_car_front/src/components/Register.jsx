import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    personal_id: null,
    drivers_licence: null,
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value, 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("personal_id", formData.personal_id);
    formDataToSend.append("drivers_licence", formData.drivers_licence);
  
    // Proverimo da li se podaci ispravno formiraju
    console.log("Podaci koji se šalju:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        body: formDataToSend, 
        headers: {
          Accept: "application/json", 
        },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(JSON.stringify(data.error || "Došlo je do greške pri registraciji."));
      }
  
      alert("Registracija uspešna! Preusmeravamo vas na login stranicu.");
      navigate("/");
    } catch (error) {
      console.log("Greška u registraciji:", error);
      setError(error.message);
    }
  };
  
  
  return (
    <div className="register-container">
      <h2>Registracija</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">
        <div className="form-group">
          <label style={{ color: "white" }}>Ime</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label style={{ color: "white" }}>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label style={{ color: "white" }}>Lozinka</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label style={{ color: "white" }}>Lična karta (jpg, png, pdf)</label>
          <input type="file" name="personal_id" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label style={{ color: "white" }}>Vozačka dozvola (jpg, png, pdf)</label>
          <input type="file" name="drivers_licence" onChange={handleChange} required />
        </div>

        <Button text="Registruj se" type="submit" />
      </form>

      <Button text="Nazad na login" onClick={() => navigate("/")} />
    </div>
  );
};

export default Register;

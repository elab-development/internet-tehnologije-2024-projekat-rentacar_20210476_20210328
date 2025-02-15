import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Navigation from "./components/Navigation";
import Users from "./components/Users";
import AllRents from "./components/AllRents";
import "./App.css";


function App() {
  const [userData, setUserData] = useState({
    id: null,
    role: null,
    name: null,
    token: null,
  });

  useEffect(() => {
    // Povlačimo podatke iz sessionStorage na učitavanju stranice
    const storedId = sessionStorage.getItem("userId");
    const storedRole = sessionStorage.getItem("userRole");
    const storedName = sessionStorage.getItem("userName");
    const storedToken = sessionStorage.getItem("userToken");

    if (storedId && storedRole && storedToken ^ storedName) {
      setUserData({
        id: storedId,
        role: storedRole,
        name: storedName,
        token: storedToken,
      });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); // Brišemo podatke iz sessionStorage
    setUserData({
      id: null,
      role: null,
      name: null,
      token: null,
    });
  };

  return (
    <Router>
       <Navigation userData={userData} handleLogout={handleLogout} />
      <Routes>
        {/* Ove stranice su za sve korisnike - neulogovane */}
        <Route path="/" element={<Login setUserData={setUserData} />} />
        <Route path="/register" element={<Register />} />

        {/* Ove stranice su za regular korisnike */}
        <Route
          path="/home"
          element={
            userData.token && userData.role === "regular" ? (
              <Home userData={userData} />
            ) : (
              <Navigate to="/" />
            )
          }
        />


        {/* Ove stranice su za administratore */}
        <Route
          path="/dashboard"
          element={
            userData.token && userData.role === "admin" ? (
              <Dashboard userData={userData} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/users"
          element={
            userData.token && userData.role === "admin" ? (
              <Users userData={userData} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
         <Route
          path="/rents"
          element={
            userData.token && userData.role === "admin" ? (
              <AllRents userData={userData} />
            ) : (
              <Navigate to="/" />
            )
          }
        />



      </Routes>
    </Router>
  );
};

export default App;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import "./App.css";

function App() {
  const [userData, setUserData] = useState({
    id: sessionStorage.getItem("userId"),
    role: sessionStorage.getItem("userRole"),
    token: sessionStorage.getItem("userToken"),
  });

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login setUserData={setUserData} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

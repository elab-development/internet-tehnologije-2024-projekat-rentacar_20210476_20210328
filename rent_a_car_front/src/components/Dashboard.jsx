import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Footer from "./Footer";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import useGif from "../hooks/useGif";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const Dashboard = ({ userData }) => {
  const navigate = useNavigate();

  const navigateToUsers = () => navigate("/users");
  const navigateToRents = () => navigate("/rents");

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const { gifUrl, loading: gifLoading, error: gifError } = useGif();

  useEffect(() => {
    const token = userData.token || sessionStorage.getItem("userToken");
    if (!token) {
      setStatsError("Niste autorizovani za prikaz statistike.");
      setLoadingStats(false);
      return;
    }

    fetch(`${API_BASE}/rents/stats`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => setStats(data))
      .catch(() => setStatsError("Greška pri učitavanju statistike."))
      .finally(() => setLoadingStats(false));
  }, [userData.token]);

  return (
    <div className="dashboard-page">
      <div className="header">
        <h1>Zdravo, {userData.name}!</h1>
        <div className="about-content">
          <h2>Administratorski Panel</h2>
          <p>Ovde možete pratiti korisnike i rentiranja.</p>
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

      {loadingStats ? (
        <p className="stats-loading">Učitavanje statistike...</p>
      ) : statsError ? (
        <p className="stats-error">{statsError}</p>
      ) : (
        <section className="charts-container">
          <div className="chart-card">
            <h3>Mesečni trend rentiranja</h3>
            <ResponsiveContainer width="90%" height={300}>
              <LineChart data={stats.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip labelStyle={{ color: "#4caf50" }} />
                <Legend verticalAlign="top" />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Broj rentiranja"
                  stroke="#4caf50"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#4caf50" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Rentiranja po automobilu</h3>
            <ResponsiveContainer width="90%" height={300}>
              <BarChart data={stats.rents_per_car}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="car_name"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip labelStyle={{ color: "#ff9800" }} />
                <Legend verticalAlign="top" />
                <Bar
                  dataKey="count"
                  name="Broj rentiranja"
                  fill="#ff9800"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <section className="gif-container">
        {gifLoading ? (
          <p>Učitavanje GIF-a...</p>
        ) : gifError ? (
          <p className="gif-error">{gifError}</p>
        ) : (
          <img src={gifUrl} alt="Random car gif" />
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;

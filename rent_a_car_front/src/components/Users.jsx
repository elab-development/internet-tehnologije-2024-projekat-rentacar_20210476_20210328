// src/components/UsersDashboard.jsx

import React, { useState, useEffect } from "react";
import Table from "./Table";
import Button from "./Button";
import Modal from "./Modal";
import { Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const UsersDashboard = ({ userData }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Modal / form state
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [formErrors, setFormErrors] = useState({});

  // Fetch all users (admin only)
  useEffect(() => {
    if (!userData.token) {
      setError("Neautorizovan pristup.");
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/users`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        } else {
          setError(data.error || "Greška pri učitavanju korisnika");
        }
      } catch {
        setError("Došlo je do greške.");
      }
    };
    fetchUsers();
  }, [userData.token]);

  // Open modal and populate form
  const openModal = (user) => {
    setSelectedUser(user);
    setForm({ name: user.name, email: user.email });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = userData.token;
    try {
      const res = await fetch(`${API_BASE}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 422 && data.errors) {
        setFormErrors(data.errors);
        return;
      }
      if (!res.ok) {
        alert(data.error || "Serverska greška.");
        return;
      }

      // Update local table state
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? data.user : u))
      );
      closeModal();
    } catch (err) {
      alert("Greška pri ažuriranju: " + err.message);
    }
  };

  return (
    <div className="users-container">
      <h1>Svi Korisnici</h1>
      <h3>
        Ovde se može videti spisak svih korisnika koji koriste ovu aplikaciju
      </h3>
      <div>
        <Link to="/dashboard">Administrativni Panel</Link> &gt;{" "}
        <span>Svi korisnici</span>
      </div>

      {error && <p className="error-message">{error}</p>}

      <Table
        columns={["name", "email", "role", "action"]}
        data={users.map((u) => ({
          ...u,
          action: (
            <Button text="Izmeni" onClick={() => openModal(u)} />
          ),
        }))}
      />

      {showModal && (
        <Modal onClose={closeModal}>
          <div className="user-modal-content">
            <h2>Izmeni korisnika</h2>

            <div className="form-group">
              <label>Ime:</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
              />
              {formErrors.name && (
                <p className="field-error">{formErrors.name[0]}</p>
              )}
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
              />
              {formErrors.email && (
                <p className="field-error">{formErrors.email[0]}</p>
              )}
            </div>

            <div className="modal-buttons">
              <Button text="Sačuvaj" onClick={handleSubmit} />
              <Button text="Otkaži" onClick={closeModal} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UsersDashboard;

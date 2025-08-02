import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Modal from "./Modal";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const Login = ({ setUserData }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // reset‐password modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetForm, setResetForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [resetErrors, setResetErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(null);

  // login handlers
  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Neuspešna prijava.");

      const { id, role, name } = data.user;
      const { token } = data;
      sessionStorage.setItem("userId", id);
      sessionStorage.setItem("userRole", role);
      sessionStorage.setItem("userName", name);
      sessionStorage.setItem("userToken", token);
      setUserData({ id, role, name, token });

      alert("Uspešno ste prijavljeni!");
      navigate(role === "admin" ? "/dashboard" : "/home");
    } catch (err) {
      setError(err.message);
    }
  };

  // reset‐password modal handlers
  const openResetModal = () => {
    setShowResetModal(true);
    setResetForm({ email: "", password: "", password_confirmation: "" });
    setResetErrors({});
    setResetSuccess(null);
  };
  const closeResetModal = () => {
    setShowResetModal(false);
    setResetErrors({});
    setResetSuccess(null);
  };
  const handleResetChange = (e) => {
    setResetForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };
  const handleResetSubmit = async () => {
    setResetErrors({});
    setResetSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(resetForm),
      });
      const data = await res.json();

      if (res.status === 422 && data.errors) {
        setResetErrors(data.errors);
        return;
      }
      if (!res.ok) {
        alert(data.error || "Serverska greška pri resetu lozinke.");
        return;
      }

      setResetSuccess(data.message);
    } catch (err) {
      alert("Greška pri komunikaciji sa serverom: " + err.message);
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

        <p>
          <button className="link-button" onClick={openResetModal}>
            Zaboravljena lozinka?
          </button>
        </p>

        <p className="register-text">
          Nemate nalog? Registrujte se klikom na dugme ispod:
        </p>
        <Button text="Registracija" onClick={() => navigate("/register")} />
      </div>

      {showResetModal && (
        <Modal onClose={closeResetModal}>
          <div className="reset-modal-content">
            <h2>Reset lozinke</h2>

            {resetSuccess && (
              <p className="success-message">{resetSuccess}</p>
            )}

            <div className="form-group">
              <label>Vaš email</label>
              <input
                type="email"
                name="email"
                value={resetForm.email}
                onChange={handleResetChange}
                required
              />
              {resetErrors.email && (
                <p className="field-error">{resetErrors.email[0]}</p>
              )}
            </div>

            <div className="form-group">
              <label>Nova lozinka</label>
              <input
                type="password"
                name="password"
                value={resetForm.password}
                onChange={handleResetChange}
                required
              />
              {resetErrors.password && (
                <p className="field-error">{resetErrors.password[0]}</p>
              )}
            </div>

            <div className="form-group">
              <label>Potvrdite lozinku</label>
              <input
                type="password"
                name="password_confirmation"
                value={resetForm.password_confirmation}
                onChange={handleResetChange}
                required
              />
              {resetErrors.password_confirmation && (
                <p className="field-error">
                  {resetErrors.password_confirmation[0]}
                </p>
              )}
            </div>

            <div className="modal-buttons">
              <Button text="Resetuj" onClick={handleResetSubmit} />
              <Button text="Otkaži" onClick={closeResetModal} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Login;

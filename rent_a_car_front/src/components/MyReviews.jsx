// src/components/MyReviews.jsx
import React, { useState, useEffect } from "react";
import Button from "./Button";
import Modal from "./Modal";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [rents, setRents]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Modal + form state
  const [showModal, setShowModal]         = useState(false);
  const [isEditing, setIsEditing]         = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  const [form, setForm] = useState({
    rent_id: "",
    review: "",
    rating: "5",
  });
  const [formErrors, setFormErrors] = useState({});

  // grab current user info
  const userId   = sessionStorage.getItem("userId");
  const userRole = sessionStorage.getItem("userRole");

  // load all reviews + your rents
  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (!token) {
      setError("Morate biti prijavljeni.");
      setLoading(false);
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    Promise.all([
      fetch(`${API_BASE}/reviews`,  { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/myrents`,   { headers }).then((r) => r.json()),
    ])
      .then(([revData, rentData]) => {
        // only reviews for which rent.user.id === userId
        const mine = (revData.reviews || []).filter(
          (rev) => rev.rent.user.id.toString() === userId
        );
        setReviews(mine);
        setRents(rentData.rents || []);
      })
      .catch(() => setError("Greška pri učitavanju podataka."))
      .finally(() => setLoading(false));
  }, [userId]);

  const openCreate = () => {
    setForm({ rent_id: "", review: "", rating: "5" });
    setFormErrors({});
    setIsEditing(false);
    setCurrentReview(null);
    setShowModal(true);
  };

  const openEdit = (rev) => {
    setForm({
      rent_id: rev.rent.id.toString(),
      review: rev.review,
      rating: rev.rating.toString(),
    });
    setFormErrors({});
    setCurrentReview(rev);
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    const token = sessionStorage.getItem("userToken");
    const url   = isEditing
      ? `${API_BASE}/reviews/${currentReview.id}`
      : `${API_BASE}/reviews`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
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
        throw new Error(data.error || "Serverska greška.");
      }

      // update local list
      if (isEditing) {
        setReviews((r) =>
          r.map((rv) =>
            rv.id === currentReview.id ? data.review : rv
          )
        );
      } else {
        // only add if it belongs to you
        if (data.review.rent.user.id.toString() === userId) {
          setReviews((r) => [...r, data.review]);
        }
      }
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sigurno obrisati?")) return;
    const token = sessionStorage.getItem("userToken");
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Greška pri brisanju.");
      setReviews((r) => r.filter((rv) => rv.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Učitavanje...</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="my-reviews-container">
      <h1>Moje Recenzije</h1>
      <Button text="Dodaj recenziju" onClick={openCreate} />

      {reviews.length ? (
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Automobil</th>
              <th>Review</th>
              <th>Ocena</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((rv) => (
              <tr key={rv.id}>
                <td>{rv.rent.car.car_name}</td>
                <td>{rv.review}</td>
                <td>
                  {[1,2,3,4,5].map((n) => (
                    <span
                      key={n}
                      className={`star display ${
                        +rv.rating >= n ? "selected" : ""
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </td>
                <td>
                  <Button text="Izmeni" onClick={() => openEdit(rv)} />
                  {(
                    userRole === "admin" ||
                    rv.rent.user.id.toString() === userId
                  ) && (
                    <Button
                      text="Obriši"
                      onClick={() => handleDelete(rv.id)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Još nema recenzija.</p>
      )}

      {showModal && (
        <Modal onClose={closeModal}>
          <h2>{isEditing ? "Izmeni recenziju" : "Nova recenzija"}</h2>

          <div className="form-group">
            <label>Renta:</label>
            <select
              name="rent_id"
              value={form.rent_id}
              onChange={handleChange}
            >
              <option value="">— izaberi rentu —</option>
              {rents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.car.car_name} ({r.rent_start_date}–{r.rent_end_date})
                </option>
              ))}
            </select>
            {formErrors.rent_id && (
              <p className="field-error">{formErrors.rent_id[0]}</p>
            )}
          </div>

          <div className="form-group">
            <label>Tekst recenzije:</label>
            <textarea
              name="review"
              rows={4}
              value={form.review}
              onChange={handleChange}
            />
            {formErrors.review && (
              <p className="field-error">{formErrors.review[0]}</p>
            )}
          </div>

          <div className="form-group">
            <label>Ocena:</label>
            <div className="star-rating-input">
              {[1,2,3,4,5].map((n) => (
                <span
                  key={n}
                  className={`star ${
                    +form.rating >= n ? "selected" : ""
                  }`}
                  onClick={() =>
                    setForm({ ...form, rating: n.toString() })
                  }
                >
                  ★
                </span>
              ))}
            </div>
            {formErrors.rating && (
              <p className="field-error">{formErrors.rating[0]}</p>
            )}
          </div>

          <div className="modal-buttons">
            <Button text="Sačuvaj" onClick={submit} />
            <Button text="Otkaži" onClick={closeModal} />
          </div>
        </Modal>
      )}
    </div>
  );
}

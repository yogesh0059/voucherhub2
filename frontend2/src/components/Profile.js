import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [yourCoupons, setYourCoupons] = useState([]);
  const [visitedCoupons, setVisitedCoupons] = useState([]);
  const [purchasedCoupons, setPurchasedCoupons] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    setUser(u);

    if (!u) return;

    if (u.role === "admin") {
      // All coupons added by Admin
      axios.get(`${API_URL}/api/coupons?addedBy=${u.email}`)
        .then(res => setYourCoupons(res.data));
    } else {
      // User side: Visited & Purchased
      axios.get(`${API_URL}/api/user-visited?user=${u.email}`)
        .then(res => setVisitedCoupons(res.data));
      axios.get(`${API_URL}/api/user-purchased?user=${u.email}`)
        .then(res => setPurchasedCoupons(res.data));
    }
  }, []);

  // EDIT & DELETE logic
  const handleDelete = (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    axios.delete(`${API_URL}/api/coupons/${id}`)
      .then(() => setYourCoupons(yourCoupons.filter(c => c._id !== id)));
  };
  const handleEdit = (id) => {
    alert("Edit coupon: " + id);
  };

  if (!user) {
    return <div style={{ textAlign: 'center', margin: '70px 0' }}>Login required</div>;
  }

  // Helper function to always get full backend URL for images
  const getImgUrl = (img) =>
    img && (img.startsWith("http") ? img : `${API_URL}${img}`);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 16 }}>
      <h2 style={{ color: '#3d246c' }}>Welcome, {user.name || user.email}</h2>
      <div><b>Email:</b> {user.email}</div>
      <div><b>Role:</b> {user.role}</div>

      <hr style={{ margin: '22px 0' }} />

      {/* ADMIN PANEL */}
      {user.role === "admin" && (
        <>
          <button
            style={{
              background: '#5428d9',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              borderRadius: 8,
              padding: '8px 22px',
              border: 'none',
              margin: '14px 0',
              cursor: 'pointer',
              float: 'right'
            }}
            onClick={() => window.location.href = "/add-coupon"}
          >
            + Add Coupon
          </button>
          <h3 style={{ marginTop: 60 }}>Your Added Coupons</h3>
          {yourCoupons.length === 0 && <div style={{ padding: 12, color: '#b83897' }}>No coupons added yet!</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {yourCoupons.map(c => (
              <div key={c._id} style={{ boxShadow: '0 1.5px 12px #ddd', borderRadius: 12, padding: 12, width: 236, position: 'relative' }}>
                <img src={getImgUrl(c.thumbnail || (c.images && c.images[0]))} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8 }} alt={c.title} />
                <h4>{c.title}</h4>
                <div>₹{c.price} | {c.discount}% Off</div>
                <div>Expires: {c.expiry}</div>
                <button style={{ marginTop: 10, marginRight: 6 }} onClick={() => handleEdit(c._id)}>Edit</button>
                <button style={{ background: '#be246a', color: '#fff', marginTop: 10 }} onClick={() => handleDelete(c._id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* USER PANEL */}
      {user.role !== "admin" && (
        <>
          <h3>Visited Coupons</h3>
          {visitedCoupons.length === 0 && <div style={{ padding: 12, color: '#b83897' }}>No Visited Coupons</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {visitedCoupons.map(c => (
              <div key={c._id} style={{ boxShadow: '0 1.5px 12px #ddd', borderRadius: 12, padding: 12, width: 236 }}>
                <img src={getImgUrl(c.thumbnail || (c.images && c.images[0]))} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8 }} alt={c.title} />
                <h4>{c.title}</h4>
                <div>₹{c.price} | {c.discount}% Off</div>
                <div>Expires: {c.expiry}</div>
              </div>
            ))}
          </div>
          <h3 style={{ marginTop: 26 }}>Purchased Coupons</h3>
          {purchasedCoupons.length === 0 && <div style={{ padding: 12, color: '#b83897' }}>No Purchased Coupons</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {purchasedCoupons.map(c => (
              <div key={c._id} style={{ boxShadow: '0 1.5px 12px #ddd', borderRadius: 12, padding: 12, width: 236 }}>
                <img src={getImgUrl(c.thumbnail || (c.images && c.images[0]))} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8 }} alt={c.title} />
                <h4>{c.title}</h4>
                <div>₹{c.price} | {c.discount}% Off</div>
                <div>Expires: {c.expiry}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

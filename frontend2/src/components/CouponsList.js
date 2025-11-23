import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

export default function CouponsList() {
  const [coupons, setCoupons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/coupons`)
      .then(res => setCoupons(res.data));
  }, []);

  // Helper for correct image URL
  const getImgUrl = (img) =>
    img && (img.startsWith('http') ? img : `${API_URL}${img}`);

  return (
    <div style={{ maxWidth: "1140px", margin: "32px auto", padding: "24px" }}>
      <h2 style={{fontWeight:800, color:'#3d246c', margin:"24px 0"}}>🔥 Featured Coupons</h2>
      <div style={{ display: 'flex', flexWrap: "wrap", gap: "32px" }}>
        {coupons.map(coupon => (
          <div key={coupon._id} style={{
            boxShadow: '0 1.5px 12px #ddd',
            borderRadius: 16,
            background: "#fff",
            width: 260,
            padding: 18,
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
            onClick={() => navigate(`/coupons/${coupon._id}`)}>
            <img
              src={getImgUrl(coupon.thumbnail ? coupon.thumbnail : (coupon.images && coupon.images[0]))}
              style={{
                width: "100%",
                height: "128px",
                objectFit: "cover",
                borderRadius: 12,
                marginBottom: 6
              }}
              alt={coupon.title}
              loading="lazy"
            />
            <h4 style={{fontSize:18, margin:'10px 0 0'}}>{coupon.title}</h4>
            <div style={{ color: "#5126ba", fontWeight: 600, fontSize: 16 }}>
              ₹{coupon.price} <span style={{ color: "#126928" }}>| {coupon.discount}% OFF</span>
            </div>
            <div style={{ color: "#aaa", fontSize: 13, margin: "10px 0 0" }}>
              Expires: {coupon.expiry}
            </div>
            <div style={{
              marginTop:8,
              color:'#be4487',
              fontSize:14,
              fontWeight:500,
              letterSpacing:1
            }}>
              CODE: {coupon.code}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

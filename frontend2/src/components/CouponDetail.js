import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Payment from './Payment';
import { API_URL } from '../api';
// import { AuthContext } from '../context/AuthContext';

export default function CouponDetail() {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [showCode, setShowCode] = useState(false);

  // --- Real me login user ka email context/store se likhna hai ---
  const userEmail = 'testuser@demo.com'; // Demo ke liye hardcoded, replace with real user email

  useEffect(() => {
    axios.get(`${API_URL}/api/coupons/${id}`)
      .then(res => setCoupon(res.data));
  }, [id]);

  if (!coupon) return <div style={{textAlign:'center', marginTop:'48px'}}>Loading...</div>;

  function getMaskedCode(code) {
    if (!code || code.length < 4) return "****";
    const visible = code.slice(0, Math.floor(code.length/2));
    const masked = "*".repeat(code.length - visible.length);
    return visible + masked;
  }

  // Safe image URL builder
  function getImgUrl(url) {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_URL}${url}`;
  }

  // Payment ke success ke baad
  function handlePaymentSuccess() {
    setShowCode(true);
  }

  return (
    <div style={{
      maxWidth: 480,
      margin: '32px auto',
      background: '#fff',
      padding: 32,
      borderRadius: 16,
      boxShadow: '0 1.5px 16px #ddd'
    }}>
      {/* Main image ― pehli gallery image */}
      <img
        src={getImgUrl(coupon.images && coupon.images[0])}
        style={{width:'100%', height:220, borderRadius:12, objectFit:'cover'}}
        alt="main"
      />
      <h2 style={{margin:'20px 0 10px'}}>{coupon.title}</h2>
      <div style={{fontWeight:600, fontSize:20, color:'#5126ba'}}>
        ₹{coupon.price} <span style={{ color: "#26ba55" }}>| {coupon.discount}% OFF</span>
      </div>
      <p style={{marginTop:7, color:'#555'}}>{coupon.description}</p>
      <div style={{color:'#be4487', fontWeight:500, marginTop:6}}>
        Coupon Code: {
          showCode
            ? coupon.code
            : getMaskedCode(coupon.code)
        }
        {!showCode &&
          <div style={{marginTop:18}}>
            {/* Payment component => couponId and userEmail pass karo! */}
            <Payment
              onSuccess={handlePaymentSuccess}
              couponId={coupon._id}
              userEmail={userEmail}
            />
          </div>
        }
      </div>
      <div style={{color:'#aaa'}}>Expires: {coupon.expiry}</div>
      <h4 style={{margin:'22px 0 8px'}}>Product Gallery:</h4>
      <div style={{
        display:'flex',
        gap:12,
        flexWrap:'wrap',
        paddingBottom:16
      }}>
        {coupon.images && coupon.images.length > 0 && coupon.images.map((url, i) => (
          <img
            key={i}
            src={getImgUrl(url)}
            alt={`img ${i + 1}`}
            style={{
              width: 120,
              height: 90,
              borderRadius: 8,
              objectFit: 'cover',
              border: '1px solid #eee',
              background:'#fafafa',
            }}
          />
        ))}
      </div>
    </div>
  );
}

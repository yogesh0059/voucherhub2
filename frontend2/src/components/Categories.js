import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Categories.css';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

const Categories = () => {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/coupons`)
      .then(res => setCoupons(res.data))
      .catch(err => console.error('Error loading coupons from backend', err));
  }, []);

  const filtered = coupons
    .filter(v => v.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price') return a.price - b.price;
      if (sort === 'discount') return b.discount - a.discount;
      if (sort === 'expiry') return new Date(a.expiry) - new Date(b.expiry);
      return 0;
    });

  // Helper: backend url for image  
  const getImgUrl = (img) =>
    img && (img.startsWith('http') ? img : `${API_URL}${img}`);

  return (
    <section id="categories" className="categories">
      <h3>Voucher Categories</h3>
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search vouchers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="price">Price (Low to High)</option>
          <option value="discount">Discount (High to Low)</option>
          <option value="expiry">Expiry Date (Soonest First)</option>
        </select>
      </div>
      <div className="voucher-grid">
        {filtered.map(v => (
          <div 
            key={v._id} 
            className="voucher-card" 
            onClick={() => navigate(`/coupons/${v._id}`)}
          >
            <img
              src={getImgUrl(v.thumbnail ? v.thumbnail : (v.images && v.images[0]))}
              alt={v.title}
              className="coupon-thumbnail"
            />
            <h4>{v.title}</h4>
            <p>
              Price: ₹{v.price}<br />
              Discount: {v.discount}%<br />
              Expires: {v.expiry}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;

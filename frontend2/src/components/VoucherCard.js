import React from 'react';
import '../styles/VoucherCard.css';

const VoucherCard = ({ coupon, onClick }) => {
  return (
    <div className="voucher-card" onClick={onClick}>
      <img
        src={coupon.thumbnail}
        alt={coupon.title}
        className="voucher-card-image"
      />
      <h4 className="voucher-card-title">{coupon.title}</h4>
      <p className="voucher-card-details">
        Price: ₹{coupon.price}<br />
        Discount: {coupon.discount}%<br />
        Expires: {coupon.expiry}
      </p>
    </div>
  );
};

export default VoucherCard;

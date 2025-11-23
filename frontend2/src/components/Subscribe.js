import React from 'react';
import '../styles/Subscribe.css';

const Subscribe = () => {
  return (
    <section className="subscribe-section">
      <h2>Stay Updated!</h2>
      <p>Subscribe to get the latest voucher deals straight to your inbox.</p>
      <form className="subscribe-form">
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
};

export default Subscribe;

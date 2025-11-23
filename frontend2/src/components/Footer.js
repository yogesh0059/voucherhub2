import React from 'react';
import { FaInstagram, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} VoucherHub. All rights reserved.</p>
      <div className="social-icons">
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          <FaInstagram />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          <FaFacebookF />
        </a>
        <a href="https://x.com" target="_blank" rel="noreferrer">
          <FaXTwitter />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

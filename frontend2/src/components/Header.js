import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" className="logo-link">VoucherHUB</Link>
        </div>
        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/categories" className={location.pathname === '/categories' ? 'active' : ''}>Categories</Link>
          <Link to="/subscribe" className={location.pathname === '/subscribe' ? 'active' : ''}>Subscribe</Link>
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
          <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Signup</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
            <span role="img" aria-label="profile" style={{marginRight:3}}>👤</span>Profile
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

// src/components/Hero.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Hero.css';

// Images
import subscriptionIcon from '../assets/subscription.png';
import supportIcon from '../assets/support.png';
import couponIcon from '../assets/coupon.png';

const Hero = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="hero-wrapper hero-bg">
      <div className="hero-main" data-aos="fade-down">
        <h1 className="hero-title">VOUCHERHUB WELCOMES YOU!</h1>
        <p className="hero-subtitle">
          Discover various coupons in various categories according to your need.
        </p>
        <button className="hero-btn" onClick={() => navigate('/categories')}>
          🔍 Browse Categories
        </button>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="features-heading" data-aos="fade-up">Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
            <img src={subscriptionIcon} alt="Subscription" className="feature-icon" />
            <h3 className="feature-title">Flexible Subscription</h3>
            <p className="feature-desc">
              Pay as you go or subscribe monthly. Unlock premium jobs and recruiter access.
            </p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
            <img src={supportIcon} alt="Support" className="feature-icon" />
            <h3 className="feature-title">24/7 Support</h3>
            <p className="feature-desc">
              Dedicated customer support for job seekers and employers – anytime, anywhere.
            </p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="500">
            <img src={couponIcon} alt="Coupons" className="feature-icon" />
            <h3 className="feature-title">Smart Coupons</h3>
            <p className="feature-desc">
              Redeem discount codes for job postings or get featured on our homepage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

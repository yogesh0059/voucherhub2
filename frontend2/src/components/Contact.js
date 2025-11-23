import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <section className="contact-section">
      <h2>Contact Us</h2>
      <p>Have questions? We'd love to hear from you.</p>
      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message..." rows="5" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </section>
  );
};

export default Contact;

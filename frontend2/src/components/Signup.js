import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Signup.css';
import { API_URL } from '../api'; // Import path yahi, agar api.js src ke andar hai

const Signup = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Variable based endpoint
      const res = await axios.post(`${API_URL}/api/signup`, {
        ...formData,
        role: role,
      });

      if (res.data.success) {
        alert('Signup successful!');
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert(res.data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Signup error. Please try again.');
    }
  };

  return (
    <section className="signup-page">
      <div className="signup-box">
        <h2>Sign Up</h2>

        <div className="role-toggle">
          <label>
            <input
              type="radio"
              value="user"
              checked={role === 'user'}
              onChange={() => setRole('user')}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              value="admin"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
            />
            Admin
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Create Account</button>
        </form>
      </div>
    </section>
  );
};

export default Signup;

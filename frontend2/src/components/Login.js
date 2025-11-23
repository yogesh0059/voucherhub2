import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const Login = ({ setUser }) => {
  const [role, setRole] = useState('user');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login',{...credentials, role});

      if (res.status === 200 && res.data.user) {
        alert('Login successful!');
        const userData = res.data.user;
        setUser(userData);

        // Sab ke sab, HOME par hi redirect honge login ke baad!
        navigate('/');
      } else {
        alert(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <section className="login-page">
      <div className="login-box">
        <h2>Login</h2>

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
            type="email"
            name="email"
            placeholder="Email"
            required
            value={credentials.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={credentials.password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </section>
  );
};

export default Login;

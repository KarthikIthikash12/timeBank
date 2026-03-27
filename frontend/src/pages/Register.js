import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Login.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('/api/auth/register', { name, email, password });
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Initialization failed.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-nav">
        <div className="auth-logo">TIMEBANK</div>
        <div className="auth-help">?</div>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header-text">
            <h2>TIMEBANK</h2>
            <p>The Digital Horizon</p>
          </div>

          <div className="auth-toggle">
            <button 
              type="button" 
              className="toggle-btn" 
              onClick={() => {
                console.log("LOGIN CLICKED!");
                navigate('/login');
              }}
            >
              Login
            </button>
            <button type="button" className="toggle-btn active">Sign Up</button>
          </div>

          {error && <div className="error-pill">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="tech-label">USERNAME</label>
              <input
                type="text"
                required
                className="tech-input"
                placeholder="TRADER NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="tech-label">EMAIL</label>
              <input
                type="email"
                required
                className="tech-input"
                placeholder="USER@EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="tech-label">PASSWORD</label>
              <input
                type="password"
                required
                className="tech-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="tech-submit">
              Create Account
            </button>
          </form>

          <div className="terms-text">
            By initializing, you agree to our <br/> <span>Temporal Protocols.</span>
          </div>
        </div>
      </div>

      <footer className="auth-footer">
        <div>© 2026 TIMEBANK. THE DIGITAL HORIZON.</div>
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Temporal Security</span>
        </div>
      </footer>
    </div>
  );
}
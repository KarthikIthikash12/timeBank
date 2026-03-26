import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Login.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.put(`http://localhost:5000/api/auth/resetpassword/${token}`, { password });
      
      setMessage('Cryptographic key updated successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token sequence.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-nav">
        <div className="auth-logo">TIMEBANK</div>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header-text">
            <h2>NEW CREDENTIALS</h2>
            <p>Establish Secure Protocol</p>
          </div>

          {message && <div className="error-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>{message}</div>}
          {error && <div className="error-pill">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="tech-label">New Password</label>
              <input
                type="password"
                required
                minLength="6"
                className="tech-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="tech-submit" disabled={loading} style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Processing...' : 'Confirm Override'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
      setMessage(res.data.message || 'Reset link dispatched to your network node.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to locate user email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <nav className="auth-nav">
        <div className="auth-logo">TIMEBANK</div>
        <div className="auth-help" onClick={() => navigate('/login')} style={{cursor: 'pointer'}}>Back</div>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header-text">
            <h2>SYSTEM RECOVERY</h2>
            <p>Initialize Password Reset</p>
          </div>

          {message && <div className="error-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>{message}</div>}
          {error && <div className="error-pill">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="tech-label">Account Email</label>
              <input
                type="email"
                required
                className="tech-input"
                placeholder="USER@HORIZON.TIME"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="tech-submit" disabled={loading} style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Transmitting...' : 'Send Recovery Link'}
            </button>
          </form>

          <div className="terms-text" style={{ marginTop: '2rem', cursor: 'pointer' }} onClick={() => navigate('/login')}>
            Return to <span>Login Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
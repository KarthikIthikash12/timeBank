import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied.');
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
            <button type="button" className="toggle-btn active">Login</button>
            <button 
              type="button" 
              className="toggle-btn" 
              onClick={() => {
                navigate('/register');
              }}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="error-pill">{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0 1rem 0' }}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  console.log("GOOGLE TOKEN RECEIVED:", credentialResponse.credential);
                  await googleSignIn(credentialResponse.credential);
                  navigate('/');
                } catch (err) {
                  console.error("BACKEND REJECTION REASON:", err.response?.data || err);
                  setError(err.response?.data?.message || 'Google Node Sync Failed.');
                }
              }}
              onError={() => {
                setError('Google Sync Terminated.');
              }}
              theme="filled_black" 
              shape="rectangular"
              useOneTap={false} 
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: '#64748b' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(100, 116, 139, 0.3)' }}></div>
            <span style={{ padding: '0 10px', fontSize: '0.75rem', letterSpacing: '2px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(100, 116, 139, 0.3)' }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="tech-label">Email</label>
              <input
                type="email"
                required
                className="tech-input"
                placeholder="USER@HORIZON.TIME"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="tech-label">Password</label>

                <span 
                  onClick={() => navigate('/forgotpassword')}
                  style={{ 
                    fontSize: '0.75rem', 
                    color: '#8b5cf6', 
                    cursor: 'pointer', 
                    letterSpacing: '1px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                >
                  Forgot?
                </span>
              </div>
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
              Sign-in
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
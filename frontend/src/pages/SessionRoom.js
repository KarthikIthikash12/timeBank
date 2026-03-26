import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './SessionRoom.css';

export default function SessionRoom() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEndSession = () => {
    if (window.confirm("Are you sure you want to end this session?")) {
      navigate('/'); 
    }
  };

  return (
    <div className="room-container">
      <header className="room-header">
        <div className="room-title">
          <span className="live-badge">Live</span>
          Temporal Node Protocol
        </div>
        <div className="timer">{formatTime(timeLeft)}</div>
      </header>

      <main className="room-main">
        <div className="video-grid active">
          <div className="video-feed primary">
            <div className="avatar-placeholder">👤</div>
            <div className="user-label">Connected Peer</div>
          </div>
          
          <div className="video-feed">
            <div className="avatar-placeholder">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-label">{user?.name || 'You'}</div>
          </div>
        </div>

        <aside className="chat-sidebar">
          <div className="chat-header">Session Chat</div>
          <div className="chat-messages">
            <div style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>
              Secure connection established. Chat is end-to-end encrypted.
            </div>
          </div>
          <div className="chat-input-area">
            <input type="text" placeholder="Type a message..." />
            <button className="control-btn" style={{ width: 'auto', padding: '0 1rem', borderRadius: '8px' }}>Send</button>
          </div>
        </aside>
      </main>

      <footer className="controls-bar">
        <button className="control-btn">🎤</button>
        <button className="control-btn">📷</button>
        <button className="control-btn">💻</button>
        <button className="control-btn danger" onClick={handleEndSession}>End Session</button>
      </footer>
    </div>
  );
}
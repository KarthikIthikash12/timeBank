import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Vault.css'; 
import './Profile.css'; 
import toast from 'react-hot-toast';

export default function Exchange() {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [duration, setDuration] = useState(60);
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState('');
  const [sessionTitle, setSessionTitle] = useState('');
  const [topics, setTopics] = useState('');
  const [category, setCategory] = useState('Programming');

  useEffect(() => {
    if (user) {
      setDuration(user.sessionDuration || 60);
      setSlots(user.availableSlots || []);
      setSessionTitle(user.sessionTitle || ''); 
      setTopics(user.topics || '');    
      setCategory(user.category || 'Programming');         
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddSlot = () => {
    if (newSlot.trim() !== '' && !slots.includes(newSlot)) {
      setSlots([...slots, newSlot]);
      setNewSlot('');
    }
  };

  const handleRemoveSlot = (slotToRemove) => {
    setSlots(slots.filter(s => s !== slotToRemove));
  };

  const handleSaveTeacherSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/users/profile', {
        sessionDuration: duration,
        availableSlots: slots,
        sessionTitle: sessionTitle, 
        topics: topics, 
        category: category
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setUser(res.data);
      toast.success('Teacher settings updated successfully!');
    } catch (err) {
      toast.error('Error updating settings.');
    }
  };

  const formatSlotForDisplay = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  const minDateTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  return (
    <div className="profile-container">
      <aside className="left-sidebar">
        <div className="brand-logo">TimeBank</div>
        <div className="nav-menu">
          <div className="nav-item" onClick={() => navigate('/')}>Dashboard</div>
          <div className="nav-item" onClick={() => navigate('/marketplace')}>Marketplace</div>
          <div className="nav-item" onClick={() => navigate('/vault')}>My Vault</div>
          <div className="nav-item" onClick={() => navigate('/history')}>History</div>
        </div>
        <div className="nav-menu" style={{ flexGrow: 0, marginTop: 'auto' }}>
          <div className="nav-item" onClick={() => navigate('/profile')}>Edit Profile</div>
          <div className="nav-item" onClick={handleLogout}>Log Out</div>
        </div>
      </aside>

      <main className="profile-content">
        <h1 style={{ marginBottom: '0.5rem' }}>Teacher Exchange Hub</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Control your teaching availability and session rules.</p>

        <div className="profile-card">
          {message && (
            <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '600' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSaveTeacherSettings}>
            <div className="profile-form-group">
                <div className="profile-form-group">
              <label>Session Title</label>
              <input 
                type="text" 
                className="profile-input" 
                placeholder="e.g., Advanced React Architecture"
                value={sessionTitle} 
                onChange={(e) => setSessionTitle(e.target.value)}
              />
            </div>

            <div className="profile-form-group">
              <label>Topics Covered</label>
              <textarea 
                className="profile-input" 
                placeholder="What will students learn? e.g., Hooks, Custom Context, Performance optimization..."
                value={topics} 
                onChange={(e) => setTopics(e.target.value)}
                style={{ height: '80px', resize: 'vertical' }}
              />
            </div>
            <div className="profile-form-group">
              <label>Masterclass Category</label>
              <select 
                className="profile-input" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Languages">Languages</option>
                <option value="Business">Business</option>
                <option value="Music">Music</option>
                <option value="Subject">Subject</option>
              </select>
            </div>
              <label>Session Duration (Minutes)</label>
              <select 
                className="profile-input" 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                style={{ cursor: 'pointer' }}
              >
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
                <option value={90}>90 Minutes</option>
                <option value={120}>120 Minutes</option>
              </select>
            </div>
            <div className="profile-form-group">
              <label>Available Time Slots (IST)</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input 
                  type="datetime-local" 
                  className="profile-input" 
                  value={newSlot} 
                  onChange={(e) => setNewSlot(e.target.value)}
                  min={minDateTime} 
                  style={{ colorScheme: 'dark' }} 
                />
                <button type="button" onClick={handleAddSlot} style={{ padding: '0 1.5rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {slots.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>No slots added yet. You won't be bookable!</p>
                ) : (
                  slots.map((slot, index) => (
                    <div key={index} style={{ backgroundColor: '#f1f5f9', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0' }}>

                      {formatSlotForDisplay(slot)} 
                      <span onClick={() => handleRemoveSlot(slot)} style={{ color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>×</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button type="submit" className="save-btn" style={{ marginTop: '2rem' }}>Create new session</button>
          </form>
        </div>
      </main>
    </div>
  );
}
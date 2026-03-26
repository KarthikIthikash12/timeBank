import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Vault.css'; 
import './Dashboard.css'; 
import './Marketplace.css'; 
import toast from 'react-hot-toast';
export default function Marketplace() {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');

  const categories = ['All', 'Programming', 'Design', 'Languages', 'Business', 'Music'];

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/teachers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (Array.isArray(res.data)) setTeachers(res.data);
        else if (res.data?.teachers) setTeachers(res.data.teachers);
        else if (res.data?.users) setTeachers(res.data.users);
        else setTeachers([]);
        
        setLoading(false);
      } catch (err) {
        console.error("API Request Failed:", err);
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return toast.error("Please select a time slot first!");
    
    try {
      const res = await axios.post('http://localhost:5000/api/users/book', {
        teacherId: selectedTeacher._id,
        duration: selectedTeacher.sessionDuration || 60, 
        scheduledDate: selectedSlot 
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setUser({ ...user, timeBalance: res.data.newBalance });
      toast.success(`Success! Session booked for ${selectedSlot}.`);
      setSelectedTeacher(null);
      setSelectedSlot('');
      
      setTimeout(() => {
        navigate('/'); 
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed.');
    }
  };

  const filteredTeachers = Array.isArray(teachers) ? teachers.filter((teacher) => {
    const queryMatch = (teacher.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                       (teacher.sessionTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (teacher.skillsOffered || []).some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
  
    const categoryMatch = activeCategory === 'All' || teacher.category === activeCategory;
    
    return queryMatch && categoryMatch;
  }) : [];

  return (
    <div className="marketplace-container">

      <aside className="left-sidebar">
        <div className="brand-logo">TimeBank</div>
        <div className="nav-menu">
          <div className="nav-item" onClick={() => navigate('/')}>Dashboard</div>
          <div className="nav-item active">Marketplace</div>
          <div className="nav-item" onClick={() => navigate('/vault')}>My Vault</div>
          <div className="nav-item" onClick={() => navigate('/history')}>History</div>
        </div>
        <div className="nav-menu" style={{ flexGrow: 0, marginTop: 'auto' }}>
          <div className="nav-item" onClick={() => navigate('/profile')}>Edit Profile</div>
          <div className="nav-item" onClick={handleLogout}>Log Out</div>
        </div>
      </aside>

      <main className="marketplace-content">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Global Marketplace</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>Find experts and exchange your time.</p>

        <input 
          type="text" 
          className="search-large" 
          placeholder="Search for any skill (e.g., React, Spanish, UI Design)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="category-filters">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="teacher-grid" style={{ marginTop: '2rem' }}>
          {loading ? (
            <p>Loading the network...</p>
          ) : filteredTeachers.length === 0 ? (
            <p style={{ color: '#64748b' }}>No teachers found for this category or search.</p>
          ) : (
            filteredTeachers.map((teacher) => (
              <div className="teacher-card" key={teacher._id}>
                <div className="card-top">
                  <div className="teacher-info">
                    <div className="teacher-avatar" style={{ overflow: 'hidden', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2e8f0' }}>
                      {teacher.profilePicture ? (
                        <img 
                          src={teacher.profilePicture} 
                          alt={teacher.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                        />
                      ) : (
                        <span style={{ fontWeight: 'bold', color: '#64748b' }}>
                          {teacher.name ? teacher.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      )}
                    </div>
                    <div 
                      onClick={() => navigate(`/user/${teacher._id}`)} 
                      style={{ cursor: 'pointer' }}
                    >
                      <p className="teacher-name" style={{ transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#8b5cf6'} onMouseOut={(e) => e.target.style.color = '#0f172a'}>
                        {teacher.name || 'Anonymous User'}
                      </p>
                      <p className="teacher-rating">★ 5.0 <span style={{color: '#8b8b9e'}}>(0 sessions)</span></p>
                    </div>
                  </div>
                </div>
                <h4 style={{ margin: '1rem 0 0.25rem 0', fontSize: '1.1rem', color: '#0f172a' }}>
                  {teacher.sessionTitle || "General Mentorship Session"}
                </h4>
                
                <p className="teacher-bio" style={{ marginBottom: '0.5rem' }}>
                  {teacher.bio || "Ready to exchange skills and time."}
                </p>
                {teacher.topics && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>What you'll learn:</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#334155' }}>{teacher.topics}</p>
                  </div>
                )}
                <div className="tags">
                  {teacher.skillsOffered && teacher.skillsOffered.map((skill, index) => (
                     <span key={index} className={index === 0 ? "tag primary" : "tag"}>{skill}</span>
                  ))}
                </div>
                <button className="book-btn" onClick={() => setSelectedTeacher(teacher)}>
                  Book Session ({teacher.sessionDuration || 60} mins)
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {selectedTeacher && (
        <div className="modal-overlay" onClick={() => { setSelectedTeacher(null); setSelectedSlot(''); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Booking</h3>
              <p>You are about to exchange your time</p>
            </div>
            <div className="modal-body">
              <div className="transaction-detail">
                <span style={{color: '#64748b'}}>Teacher:</span>
                <span style={{fontWeight: '600'}}>{selectedTeacher.name || 'Anonymous User'}</span>
              </div>
              <div className="transaction-detail">
                <span style={{color: '#64748b'}}>Session Length:</span>
                <span style={{fontWeight: '600'}}>{selectedTeacher.sessionDuration || 60} Minutes</span>
              </div>
              <div className="transaction-detail" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <span>New Balance:</span>
                <span style={{color: '#8b5cf6', fontWeight: 'bold'}}>
                  {user?.timeBalance !== undefined ? user.timeBalance - (selectedTeacher.sessionDuration || 60) : 0} MINS
                </span>
              </div>
              
              <p style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Select a Time Slot:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                {selectedTeacher.availableSlots && selectedTeacher.availableSlots.length > 0 ? (
                  selectedTeacher.availableSlots.map(slot => (
                    <button 
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      style={{ 
                        padding: '0.75rem', 
                        borderRadius: '8px', 
                        border: selectedSlot === slot ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                        backgroundColor: selectedSlot === slot ? '#f5f3ff' : '#ffffff',
                        color: selectedSlot === slot ? '#8b5cf6' : '#64748b',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem', gridColumn: 'span 2', margin: 0 }}>
                    This teacher hasn't opened any time slots yet!
                  </p>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => { setSelectedTeacher(null); setSelectedSlot(''); }}>Cancel</button>
              <button className="btn-confirm" onClick={handleConfirmBooking}>Confirm Trade</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
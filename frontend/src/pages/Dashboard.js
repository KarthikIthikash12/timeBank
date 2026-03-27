
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mySchedule, setMySchedule] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [activeTopTab, setActiveTopTab] = useState('explore');
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const [showMobileSchedule, setShowMobileSchedule] = useState(false);

  const [incomingRequests, setIncomingRequests] = useState([]); 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const resTeachers = await axios.get('/api/users/teachers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (Array.isArray(resTeachers.data)) {
          setTeachers(resTeachers.data);
        } else if (resTeachers.data && Array.isArray(resTeachers.data.teachers)) {
          setTeachers(resTeachers.data.teachers);
        } else if (resTeachers.data && Array.isArray(resTeachers.data.users)) {
          setTeachers(resTeachers.data.users);
        } else {
          setTeachers([]);
        }

        const resLedger = await axios.get('/api/users/ledger', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (resLedger.data && resLedger.data.balance !== undefined) {
          setUser(prev => ({ ...prev, timeBalance: resLedger.data.balance }));
        }

        if (resLedger.data && Array.isArray(resLedger.data.history)) {
          
          const bookedSessions = resLedger.data.history.filter(tx => {
            if (tx.status === 'completed' || tx.status === 'cancelled') return false;
            if (tx.type === 'spent' && (tx.status === 'approved' || tx.status === 'pending')) return true;
            if (tx.type === 'earned' && tx.status === 'approved') return true;

            return false;
          });
          setMySchedule(bookedSessions);

          const requests = resLedger.data.history.filter(tx => 
            tx.type === 'earned' && tx.status === 'pending'
          );
          setIncomingRequests(requests);

        } else {
          setMySchedule([]);
          setIncomingRequests([]); 
        }

        setLoading(false);
      } catch (err) {
        console.error("API Request Failed:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [setUser]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return toast.error("Please select a time slot first!"); 
    
    try {
      const res = await axios.post('/api/users/book', {
        teacherId: selectedTeacher._id,
        duration: selectedTeacher.sessionDuration || 60,
        scheduledDate: selectedSlot 
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setUser({ ...user, timeBalance: res.data.newBalance });
      toast.success(`Session booked for ${selectedSlot}!`);
      
      setSelectedTeacher(null);
      setSelectedSlot('');
      setTimeout(() => {
        window.location.reload(); 
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed.'); 
    }
  };

  const handleSessionAction = async (sessionId, action) => {
    console.log("FIRING ACTION:", action, "FOR ID:", sessionId);

    try {
      const res = await axios.put(`/api/users/session/${sessionId}/status`, 
        { status: action }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(`Session ${action}!`); 
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.log("BACKEND REJECTED BECAUSE:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to update session.'); 
    }
  };
  const filteredTeachers = Array.isArray(teachers) ? teachers.filter((teacher) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = (teacher.name || '').toLowerCase().includes(query);
    const skillMatch = teacher.skillsOffered?.some(skill => 
      skill.toLowerCase().includes(query)
    );
    return nameMatch || skillMatch;
  }) : [];

  const formatScheduleDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isMeetReady = (scheduledTime, duration) => {
    if (!scheduledTime) return false; 

    const now = new Date(); 
    const scheduled = new Date(scheduledTime); 
    const minutesUntilStart = (scheduled - now) / 60000;
    return minutesUntilStart <= 10 && minutesUntilStart >= -duration;
  };
  return (
    <div className="app-container">
      <aside className="left-sidebar">
        <div className="brand-logo">TimeBank</div>
        <div className="nav-menu">
          <div className="nav-menu">
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item" onClick={() => navigate('/marketplace')}>Marketplace</div>
          <div className="nav-item" onClick={() => navigate('/vault')}>My Vault</div>
          <div className="nav-item" onClick={() => navigate('/history')}>History</div>
        </div>
        </div>
        <div className="nav-menu" style={{ flexGrow: 0 }}>
          <div className="nav-item" onClick={() => navigate('/profile')}>Edit Profile</div>
          <div className="nav-item" onClick={handleLogout}>Log Out</div>
        </div>
      </aside>

      <div className="main-content">
        <nav className="top-nav">
          <div className="top-links"
          style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'center', 
              gap: '2rem', 
              whiteSpace: 'nowrap' 
            }}>
            <span className="active" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Explore</span>
            <span onClick={() => navigate('/exchange')} style={{cursor: 'pointer'}}>Exchange</span>
            <span onClick={() => navigate('/about-us')} style={{cursor: 'pointer'}}>About Us</span>
            <span onClick={() => navigate('/help')} style={{cursor: 'pointer'}}>Help (FAQs)</span>
            <span onClick={() => navigate('/developer')} style={{cursor: 'pointer'}}>About Developer</span>
          </div>
          <div className="user-controls">
            <div className="time-pill">
              <span>●</span> {user?.timeBalance !== undefined ? user.timeBalance : 120} MINS
            </div>
            <div className="avatar" onClick={() => navigate('/my-profile')} style={{cursor: 'pointer', overflow: 'hidden', padding: 0}}>
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Avatar" 
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontWeight: 'bold', color: '#fff' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="dashboard-layout">
          <button 
            className="mobile-schedule-toggle" 
            onClick={() => setShowMobileSchedule(!showMobileSchedule)}
          >
            {showMobileSchedule ? 'Hide Schedule' : '📅 View My Schedule'}
          </button>
          <main className="center-feed">
            <div className="hero-section">
              <h1>
                Learn anything,<br />
                <span className="gradient-text">pay with your time</span>
              </h1>
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Search skills (e.g. React, UI Design...)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn">Search</button>
              </div>
            </div>

            <div className="section-header">
              <div>
                <h2>Explore Teachers</h2>
                <p>Top rated experts ready to exchange knowledge.</p>
              </div>
            </div>

            <div className="teacher-grid">
              {loading ? (
                <p style={{ color: '#64748b' }}>Loading teachers from database...</p>
              ) : filteredTeachers.length === 0 ? (
                <p style={{ color: '#64748b' }}>No teachers found matching "{searchQuery}".</p>
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
                              referrerPolicy="no-referrer"
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

          <aside className={`right-sidebar ${showMobileSchedule ? 'show-mobile' : ''}`}>
            {incomingRequests.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div className="schedule-header" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#ef4444' }}>Pending Requests ({incomingRequests.length})</h3>
                </div>
                <div className="schedule-list" style={{ marginTop: '0' }}>
                  {incomingRequests.map(req => (
                    <div className="schedule-card" key={req._id} style={{ borderLeft: '4px solid #ef4444', display: 'block' }}>
                      <p className="schedule-title">{req.skill}</p>
                      <p className="schedule-with">Student: {req.counterparty}</p>
                      <p className="schedule-date" style={{ marginBottom: '1rem' }}>🕒 {req.scheduledDate}</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleSessionAction(req._id, 'approved')} style={{ flex: 1, padding: '0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Accept</button>
                        <button onClick={() => handleSessionAction(req._id, 'cancelled')} style={{ flex: 1, padding: '0.5rem', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="schedule-header" style={{ marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>My Schedule</h3>
            </div>

            <div className="schedule-list" style={{ marginTop: '0' }}>
              {loading ? (
                <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>Loading schedule...</p>
              ) : mySchedule.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>
                  No upcoming sessions. Head to the Marketplace to book a teacher!
                </p>
              ) : (
                mySchedule.slice(0, 4).map((session) => (
                  <div className="schedule-details">
                      <p className="schedule-title">{session.skill}</p>
                      <p className="schedule-with">with {session.counterparty}</p>
                      <p className="schedule-date" style={{ marginBottom: '0.75rem' }}>🕒 {session.scheduledDate || formatScheduleDate(session.date)}</p>
                      
       
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>

                        {session.status === 'approved' && session.type === 'spent' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSessionAction(session._id, 'completed'); }}
                            style={{ padding: '0.4rem 0.8rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                          >
                            Mark Completed
                          </button>
                        )}
                        {(session.status === 'approved' || session.status === 'accepted') && 
                          isMeetReady(session.scheduledDate || session.date, session.duration || 60) && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/room/${session._id}`); }}
                            style={{ 
                              padding: '0.4rem 0.8rem', 
                              background: '#3b82f6', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '4px', 
                              cursor: 'pointer', 
                              fontWeight: 'bold', 
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            🎥 {session.type === 'earned' ? 'Start Session' : 'Join Meet'}
                          </button>
                        )}

                        {session.status === 'pending' && session.type === 'spent' && (
                          <span style={{ padding: '0.4rem 0.8rem', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            Awaiting Teacher Approval
                          </span>
                        )}
                        {session.status === 'approved' && session.type === 'earned' && (
                          <span style={{ padding: '0.4rem 0.8rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            Awaiting Student Confirmation
                          </span>
                        )}

                        {(session.status === 'approved' || (session.status === 'pending' && session.type === 'spent')) && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSessionAction(session._id, 'cancelled'); }}
                            style={{ padding: '0.4rem 0.8rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                          >
                            Cancel Booking
                          </button>
                        )}

                      </div>
                    </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>

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
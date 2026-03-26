import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Vault.css'; 
import './History.css';
import toast from 'react-hot-toast';

export default function History() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalTx, setReviewModalTx] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/ledger', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data && Array.isArray(res.data.history)) {
          const studentSessions = res.data.history.filter(tx => tx.type === 'spent');
          setPastSessions(studentSessions);
        } else {
          setPastSessions([]); 
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching history", err);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const submitReview = async () => {
    if (rating === 0) return toast.error("Please select a star rating!");

    try {
      await axios.post('http://localhost:5000/api/users/review', {
        transactionId: reviewModalTx._id,
        rating: rating
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast.success("Review submitted successfully!");
      setReviewModalTx(null);
      setRating(0);
      window.location.reload(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  return (
    <div className="history-container">
      <aside className="left-sidebar">
        <div className="brand-logo">TimeBank</div>
        <div className="nav-menu">
          <div className="nav-item" onClick={() => navigate('/')}>Dashboard</div>
          <div className="nav-item" onClick={() => navigate('/marketplace')}>Marketplace</div>
          <div className="nav-item" onClick={() => navigate('/vault')}>My Vault</div>
          <div className="nav-item active">History</div>
        </div>
        <div className="nav-menu" style={{ flexGrow: 0, marginTop: 'auto' }}>
          <div className="nav-item" onClick={() => navigate('/profile')}>Edit Profile</div>
          <div className="nav-item" onClick={handleLogout}>Log Out</div>
        </div>
      </aside>

      <main className="history-content" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '0.5rem' }}>Session History</h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Review your past trades and rate your teachers.</p>
        </div>

        <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
              Decrypting academic records...
            </div>
          ) : pastSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
              No past sessions found. Head to the Marketplace to book a teacher!
            </div>
          ) : (
            pastSessions.map(session => (
              <div key={session._id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1.5rem', 
                background: '#ffffff', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)' 
              }}>
            
                <div>
                  <h3 style={{ margin: '0 0 0.3rem 0', color: '#0f172a', fontSize: '1.2rem' }}>{session.skill}</h3>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>
                    {session.type === 'spent' ? 'Taught by' : 'Booked with'} <strong style={{ color: '#0f172a' }}>{session.counterparty}</strong>
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.5rem 0 0 0' }}>
                    📅 {session.scheduledDate || new Date(session.date).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {session.isReviewed ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Reviewed ✓
                      </span>
                      <div style={{ color: '#fbbf24', fontSize: '1.2rem', letterSpacing: '2px' }}>
                        {'★'.repeat(session.ratingGiven)}{'☆'.repeat(5 - session.ratingGiven)}
                      </div>
                    </div>
                  ) : (
                  
                    session.type === 'spent' ? (
                      <button 
                        onClick={() => setReviewModalTx(session)}
                        style={{
                          padding: '0.6rem 1.2rem',
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
                      >
                        Leave a Review
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        Waiting for student review
                      </span>
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>


      {reviewModalTx && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 50
        }} onClick={() => setReviewModalTx(null)}>
          
          <div style={{
            background: 'white', padding: '2.5rem', borderRadius: '16px',
            width: '100%', maxWidth: '450px', textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }} onClick={(e) => e.stopPropagation()}>
            
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Rate your Session</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.5' }}>
              How was your <strong>{reviewModalTx.skill}</strong> session with <strong>{reviewModalTx.counterparty}</strong>?
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star}
                  style={{
                    fontSize: '3rem',
                    color: star <= (hoverRating || rating) ? '#fbbf24' : '#e2e8f0',
                    transition: 'color 0.15s ease-in-out',
                    textShadow: star <= (hoverRating || rating) ? '0 2px 10px rgba(251, 191, 36, 0.3)' : 'none'
                  }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setReviewModalTx(null)}
                style={{ padding: '0.8rem 1.5rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={submitReview}
                disabled={rating === 0}
                style={{ padding: '0.8rem 1.5rem', background: rating === 0 ? '#cbd5e1' : '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: rating === 0 ? 'not-allowed' : 'pointer', flex: 1 }}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
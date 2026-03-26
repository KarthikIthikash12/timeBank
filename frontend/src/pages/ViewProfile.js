import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Vault.css'; 
import './ViewProfile.css';

export default function ViewProfile() {
  const { user: currentUser, logout } = useContext(AuthContext);
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isMyProfile = !id || (currentUser && id === currentUser._id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isMyProfile) {
          setProfileData(currentUser);
        } else {
          const res = await axios.get(`/api/users/${id}`);
          setProfileData(res.data);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, currentUser, isMyProfile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Profile...</div>;
  if (!profileData) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>User not found.</div>;

  return (
    <div className="view-profile-container">
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

      <main className="view-profile-content">
        <div className="public-profile-card">
          {isMyProfile && (
            <button className="edit-action-btn" onClick={() => navigate('/profile')}>
              Edit Profile
            </button>
          )}
          
          <div className="avatar-massive" style={{ overflow: 'hidden', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {profileData.profilePicture ? (
              <img src={profileData.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'
            )}
          </div>
          
          <h1 style={{ margin: '0 0 0.5rem 0' }}>{profileData.name || 'Anonymous Architect'}</h1>
          <p style={{ color: '#64748b', margin: '0 0 1.5rem 0' }}>{profileData.email}</p>

          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#334155', maxWidth: '500px', margin: '0 auto' }}>
            {profileData.bio || "This user hasn't added a bio yet, but they are ready to exchange time and skills on the network."}
          </p>

          <div className="profile-stats-row">
            <div className="stat-item">
              <h4>{profileData.timeBalance !== undefined ? profileData.timeBalance : 120}</h4>
              <p>Time Balance</p>
            </div>
            <div className="stat-item">
              <h4>★ 5.0</h4>
              <p>Global Rating</p>
            </div>
          </div>

          <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', textAlign: 'center' }}>Skills Offered</h3>
            <div className="skills-container">
              {profileData.skillsOffered && profileData.skillsOffered.length > 0 ? (
                profileData.skillsOffered.map((skill, index) => (
                  <span key={index} className="tag primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                    {skill}
                  </span>
                ))
              ) : (
                <p style={{ color: '#94a3b8', textAlign: 'center', width: '100%' }}>No skills listed yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
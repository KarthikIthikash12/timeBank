import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Vault.css'; 
import './Profile.css';

export default function Profile() {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(Array.isArray(user?.skills) ? user.skills.join(', ') : user?.skills || '');
  const [message, setMessage] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [picLoading, setPicLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setSkills(Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || '');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/users/profile', {
        name,
        bio,
        skillsOffered: skills,
        profilePicture: user.profilePicture 
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

     
      setUser({ ...user, ...res.data }); 
      
      setMessage('Identity updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating profile.');
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  
  const handlePictureUpload = async () => {
    if (!selectedFile) return;
    setPicLoading(true);
    
    const formData = new FormData();
    formData.append('image', selectedFile); 

    try {
      const res = await axios.post('http://localhost:5000/api/users/profile-picture', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
      setUser({ ...user, profilePicture: res.data.profilePicture });
      setSelectedFile(null); 
      setMessage('Profile picture uploaded to Cloudinary!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to upload picture. Check server logs.');
    } finally {
      setPicLoading(false);
    }
  };

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
          <div className="nav-item active">Edit Profile</div>
          <div className="nav-item" onClick={handleLogout}>Log Out</div>
        </div>
      </aside>

      <main className="profile-content">
        <h1 style={{ marginBottom: '2rem' }}>Identity Settings</h1>

        <div className="profile-card">
          <div className="profile-header-top" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            
            <div style={{ position: 'relative' }}>
              <div 
                className="avatar-large" 
                onClick={() => fileInputRef.current.click()}
                style={{ cursor: 'pointer', overflow: 'hidden', padding: 0, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {preview ? (
                  <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{name ? name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>
              
              <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
           
              <div 
                onClick={() => fileInputRef.current.click()} 
                style={{ position: 'absolute', bottom: '0px', right: '0px', background: '#8b5cf6', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', border: '2px solid white', fontSize: '0.8rem' }}
              >
                ✎
              </div>
            </div>

            <div>
              <h2 style={{ margin: '0 0 0.5rem 0' }}>{name || 'Architect'}</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Click your avatar to upload a new picture.</p>
   
              {selectedFile && (
                <button 
                  onClick={handlePictureUpload} 
                  disabled={picLoading}
                  style={{ marginTop: '0.75rem', padding: '0.4rem 0.8rem', background: '#1e293b', color: 'white', border: 'none', borderRadius: '4px', cursor: picLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  {picLoading ? 'Uploading...' : 'Confirm Picture'}
                </button>
              )}
            </div>
          </div>

          {message && (
            <div style={{ padding: '1rem', backgroundColor: message.includes('Failed') ? '#fee2e2' : '#ecfdf5', color: message.includes('Failed') ? '#991b1b' : '#059669', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '600' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div className="profile-form-group">
              <label>Teacher Name</label>
              <input type="text" className="profile-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="profile-form-group">
              <label>Skills Offered (Comma Separated)</label>
              <input type="text" className="profile-input" placeholder="e.g. React, UI Design, Quantum Physics" value={skills} onChange={(e) => setSkills(e.target.value)} />
            </div>

            <div className="profile-form-group">
              <label>Bio</label>
              <textarea className="profile-textarea" placeholder="Tell the network about your expertise..." value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <button type="submit" className="save-btn">Save Identity</button>
          </form>
        </div>
      </main>
    </div>
  );
}
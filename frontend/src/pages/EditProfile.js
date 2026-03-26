import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const { user, setUser, token } = useContext(AuthContext); 
  const [preview, setPreview] = useState(user?.profilePicture || '');
  const [selectedFile, setSelectedFile] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); 
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setMessage('Please select a new image first.');
      return;
    }
    
    setLoading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('image', selectedFile); 

    try {
      const res = await axios.post('http://localhost:5000/api/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });

      setUser(res.data.user);
      setMessage('Profile updated successfully!');
      
      setTimeout(() => navigate('/'), 1500); 
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        
        <h2 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Edit Profile</h2>
        
        {message && <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px', background: message.includes('success') ? '#dcfce7' : '#fee2e2', color: message.includes('success') ? '#166534' : '#991b1b', fontWeight: 'bold' }}>{message}</div>}

        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem auto' }}>
          <div style={{ 
            width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', 
            background: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center',
            border: '4px solid #8b5cf6', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '3rem', color: '#64748b', fontWeight: 'bold' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            id="avatar-upload"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <label 
            htmlFor="avatar-upload" 
            style={{ 
              position: 'absolute', bottom: '0', right: '0', background: '#8b5cf6', 
              color: 'white', width: '36px', height: '36px', borderRadius: '50%', 
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer', border: '3px solid white', fontWeight: 'bold'
            }}
          >
            ✎
          </label>
        </div>

        <button 
          onClick={handleSave} 
          disabled={loading || !selectedFile}
          style={{ width: '100%', padding: '0.875rem', background: (loading || !selectedFile) ? '#cbd5e1' : '#1e293b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: (loading || !selectedFile) ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Uploading...' : 'Save Profile Picture'}
        </button>
        
        <div style={{ marginTop: '1rem', color: '#64748b', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate('/')}>
          Cancel
        </div>
      </div>
    </div>
  );
}
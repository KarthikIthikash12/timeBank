import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/api/users/profile');
          setUser(res.data); 
        } catch (error) {
          console.error("Session expired.");
          console.error("PROFILE FETCH CRASHED:", error.response || error);
          logout();
        }
      }
      setLoading(false); 
    };

    loadUser();
  }, [token]); 

  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    
    setToken(res.data.token);
    setUser(res.data); 
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    
    setToken(res.data.token);
    setUser(res.data); 
  };

  const googleSignIn = async (googleToken) => {
    const res = await axios.post('/api/auth/google', { token: googleToken });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    
    setToken(res.data.token);
    setUser(res.data); 
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, googleSignIn, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
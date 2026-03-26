import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Landing from './pages/Landing';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; 
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Vault from './pages/Vault';
import SessionRoom from './pages/SessionRoom';
import History from './pages/History'; 
import Marketplace from './pages/MarketPlace';
import ViewProfile from './pages/ViewProfile';
import Exchange from './pages/Exchange';
import { Toaster } from 'react-hot-toast'; 
import Help from './pages/Help';
import AboutUs from './pages/AboutUs';
import AboutDeveloper from './pages/AboutDeveloper';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VideoRoom from './pages/VideoRoom';


function App() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Toaster 
        position="top-center" 
        toastOptions={{ duration: 3000, style: { fontWeight: '600' } }} 
      />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/exchange" element={<ProtectedRoute><Exchange /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/room" element={<ProtectedRoute><SessionRoom /></ProtectedRoute>} />
        <Route path="/my-profile" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
        <Route path="/room/:roomId" element={<VideoRoom />} />
        <Route path="/user/:id" element={<ViewProfile />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/developer" element={<AboutDeveloper />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;
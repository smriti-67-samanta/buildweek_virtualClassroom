import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { FaComments, FaFileAlt, FaBell, FaVideo, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = ({ user, classrooms }) => {
  const navigate = useNavigate();

  // Debugging: Log the user object to see what properties are available
  console.log('Navbar user object:', user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const currentTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Function to get the best available username
  const getUsername = () => {
    if (!user) return 'User';
    
    // Check multiple possible properties where the name might be stored
    return (
      user.displayName || 
      user.name || 
      user.email?.split('@')[0] || 
      'User'
    );
  };

  return (
    <header className="dashboard-navbar">
      <div className="navbar-brand">Virtual Classroom</div>
      <div className="navbar-links">
        <a href="/dashboard" className="nav-link"></a>
        <a href="/chat" className="nav-link">
          <FaComments className="nav-icon" /> Chat
        </a>
        <a href="/documents" className="nav-link">
          <FaFileAlt className="nav-icon" /> Notes
        </a>
        <a href="/notifications" className="nav-link">
          <FaBell className="nav-icon" /> Notifications
        </a>
        <a href="/video-conference" className="nav-link">
          <FaVideo className="nav-icon" />  Conference
        </a>
      </div>
      <div className="navbar-user">
        <span className="user-name">
          <FaUser className="user-icon" /> {getUsername()}
        </span>
        <span className="current-time">{currentTime}</span>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
};

export { Navbar };
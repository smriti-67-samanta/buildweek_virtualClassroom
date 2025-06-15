import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login, Register, ProtectedRoute } from './components/Auth';
import Dashboard from './pages/Dashboard';
import CreateClassroom from './components/CreateClassroom/CreateClassroom';
import ChatPage from './pages/ChatPage';
import DocumentsPage from './pages/DocumentsPage';
import NotificationsPage from './pages/NotificationsPage';
import { VideoConference } from './components/VideoConference/VideoConference';
import { Loader } from './components/common';
import { Navbar } from './components/Dashboard';

import './styles/auth.css';
import './styles/dashboard.css';

const VideoConferenceWrapper = ({ classrooms }) => {
  const { currentUser, user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <Loader />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleLeave = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard-container">
      <Navbar user={user} classrooms={classrooms} />
      <main className="dashboard-main">
        <VideoConference
          roomName="general-meeting"
          user={{ 
            name: currentUser?.displayName || 'User', 
            email: currentUser?.email || '',
            role: user?.role || 'student'
          }}
          onLeave={handleLeave}
        />
      </main>
    </div>
  );
};

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const addNotification = (message) => {
    setNotifications(prev => [...prev, message]);
  };

  useEffect(() => {
    // Simulate notifications for testing (since backend is removed)
    const mockNotifications = [
      'Welcome to the Virtual Classroom!',
      'A new classroom has been created.'
    ];
    setNotifications(mockNotifications);

    // Simulate classrooms data (since we're not fetching from Firebase here)
    setClassrooms([
      { id: '1', name: 'Math 101', subject: 'Mathematics', description: 'Algebra and Geometry', teacherName: 'Teacher A', students: [] },
      { id: '2', name: 'Science 101', subject: 'Science', description: 'Physics Basics', teacherName: 'Teacher B', students: [] },
    ]);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard addNotification={addNotification} />} />
            <Route path="/create-classroom" element={<CreateClassroom />} />
            <Route path="/chat" element={<ChatPage addNotification={addNotification} />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/notifications" element={<NotificationsPage notifications={notifications} />} />
            <Route path="/video-conference" element={<VideoConferenceWrapper classrooms={classrooms} />} />
            <Route path="/classroom/:classroomId" element={<Dashboard addNotification={addNotification} />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
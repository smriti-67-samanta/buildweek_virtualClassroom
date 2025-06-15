// src/components/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { Loader } from '../common';
import { ChatInterface } from '../ChatInterface/ChatInterface';
import { DocumentSharing } from '../DocumentSharing/DocumentSharing';
import { ClassroomCard } from '../Dashboard/ClassroomCard';
import '../../styles/dashboard.css';

const ChatPage = () => {
  const { currentUser } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDocuments, setShowDocuments] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const classroomsRef = ref(database, 'classrooms');
      const unsubscribe = onValue(classroomsRef, (snapshot) => {
        const classroomsData = snapshot.val();
        if (classroomsData) {
          const classroomsList = Object.keys(classroomsData).map(key => ({
            id: key,
            ...classroomsData[key]
          }));
          setClassrooms(classroomsList);
        } else {
          setClassrooms([]);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleJoinChatRoom = (classroomId) => {
    setActiveChatRoom(classroomId);
    setShowDocuments(false);
  };

  const handleLeaveChatRoom = () => {
    setActiveChatRoom(null);
    setShowDocuments(false);
  };

  const toggleDocumentView = () => {
    setShowDocuments(!showDocuments);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="chat-page-container">
      {activeChatRoom ? (
        <div className="active-chat-room">
          <div className="chat-room-header">
            <h2>
              {classrooms.find(c => c.id === activeChatRoom)?.name || 'Chat Room'}
            </h2>
            {windowWidth < 768 && (
              <button 
                className="toggle-view-btn"
                onClick={toggleDocumentView}
              >
                {showDocuments ? 'Show Chat' : 'Show Documents'}
              </button>
            )}
          </div>

          <div className="chat-content-area">
            {(windowWidth >= 768 || !showDocuments) && (
              <div className="chat-interface-wrapper">
                <ChatInterface 
                  roomId={`classroom-${activeChatRoom}`}
                  currentUser={currentUser}
                />
              </div>
            )}

            {(windowWidth >= 768 || showDocuments) && (
              <div className="document-sharing-wrapper">
                <DocumentSharing 
                  roomId={`classroom-${activeChatRoom}`}
                  currentUser={currentUser}
                />
              </div>
            )}
          </div>

          <button 
            className="leave-room-btn"
            onClick={handleLeaveChatRoom}
          >
            Leave Room
          </button>
        </div>
      ) : (
        <div className="classrooms-view">
          <h1>Available Classrooms</h1>
          
          {classrooms.length > 0 ? (
            <div className="classrooms-grid">
              {classrooms.map(classroom => (
                <ClassroomCard 
                  key={classroom.id}
                  classroom={classroom}
                  onJoin={() => handleJoinChatRoom(classroom.id)}
                />
              ))}
            </div>
          ) : (
            <div className="no-classrooms">
              <div className="empty-state">
                <img src="/images/empty-classroom.svg" alt="No classrooms" />
                <h3>No classrooms available</h3>
                <p>Create a new classroom or check back later</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
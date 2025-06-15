import React, { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface/ChatInterface';
import { DocumentSharing } from '../components/DocumentSharing/DocumentSharing';
import '../styles/dashboard.css';

// Mock classroom data
const mockClassrooms = [
  {
    id: '1',
    name: 'Math 101',
    subject: 'Mathematics',
    description: 'Algebra and Calculus',
    members: { 'user1': true, 'user2': true }
  },
  {
    id: '2',
    name: 'Science Group',
    subject: 'Physics',
    description: 'Quantum mechanics discussion',
    members: { 'user1': true, 'user3': true }
  },
  {
    id: '3',
    name: 'History Club',
    subject: 'History',
    description: 'World War II studies',
    members: { 'user2': true, 'user4': true, 'user5': true }
  },
  {
    id: '4',
    name: 'Literature Circle',
    subject: 'English',
    description: 'Shakespearean plays discussion',
    members: { 'user1': true, 'user6': true }
  },
  {
    id: '5',
    name: 'Coding Bootcamp',
    subject: 'Computer Science',
    description: 'Intro to JavaScript and React',
    members: { 'user3': true, 'user5': true, 'user7': true }
  }
];

const ChatPage = () => {
  const [classrooms, setClassrooms] = useState(mockClassrooms);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleJoinChatRoom = (classroomId) => {
    setActiveChatRoom(classroomId);
  };

  const handleLeaveChatRoom = () => {
    setActiveChatRoom(null);
    setShowDocuments(false);
  };

  const toggleDocumentView = () => {
    setShowDocuments(!showDocuments);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Chat Rooms</h1>
        </div>
        {activeChatRoom ? (
          <div className="chat-room-container">
            <div className="chat-room-header">
              <h2>Classroom: {
                classrooms.find(c => c.id === activeChatRoom)?.name || 'Chat Room'
              }</h2>
              {windowWidth < 768 && (
                <button 
                  className="toggle-docs-btn"
                  onClick={toggleDocumentView}
                >
                  {showDocuments ? 'Show Chat' : 'Show Documents'}
                </button>
              )}
            </div>
            
            <div className="chat-content-container">
              {(windowWidth >= 768 || !showDocuments) && (
                <div className="chat-interface-container">
                  <ChatInterface 
                    roomId={`classroom-${activeChatRoom}`}
                    isMock={true}
                  />
                </div>
              )}
              
              {(windowWidth >= 768 || showDocuments) && (
                <div className="document-sharing-container">
                  <DocumentSharing 
                    roomId={`classroom-${activeChatRoom}`}
                    isMock={true}
                  />
                </div>
              )}
            </div>
            
            <button 
              className="leave-room-btn"
              onClick={handleLeaveChatRoom}
            >
              Leave Chat Room
            </button>
          </div>
        ) : (
          <div className="classrooms-grid">
            {classrooms.length > 0 ? (
              classrooms.map(classroom => (
                <div key={classroom.id} className="classroom-card">
                  <div className="card-header">
                    <h3>{classroom.name}</h3>
                  </div>
                  <div className="card-body">
                    <p className="subject">{classroom.subject}</p>
                    <p className="description">{classroom.description}</p>
                    <p className="members-count">
                      {classroom.members ? Object.keys(classroom.members).length : 0} members
                    </p>
                  </div>
                  <div className="card-footer">
                    <button 
                      className="join-btn"
                      onClick={() => handleJoinChatRoom(classroom.id)}
                    >
                      Join Chat
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No classrooms available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
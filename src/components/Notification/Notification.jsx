import React, { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import '../../styles/dashboard.css';
import { FaBell, FaComment, FaFileAlt, FaTimes } from 'react-icons/fa';

export const Notification = ({ onNewMessage, onNewDocument }) => {
  const [notifications, setNotifications] = useState([
    // Mock notifications that won't interfere with real ones
    { 
      id: -1, 
      text: 'System: Welcome to Virtual Classroom!',
      type: 'system'
    },
    { 
      id: -2, 
      text: 'Professor: Syllabus.pdf has been uploaded',
      type: 'document'
    }
  ]);

  const addNotification = (text) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Original effect with no changes
  React.useEffect(() => {
    if (onNewMessage) {
      const originalOnNewMessage = onNewMessage;
      onNewMessage.message = (message) => {
        addNotification(`${message.sender}: ${message.content}`);
        if (originalOnNewMessage.message) originalOnNewMessage.message(message);
      };
    }
    if (onNewDocument) {
      const originalOnNewDocument = onNewDocument;
      onNewDocument.document = (document) => {
        addNotification(`${document.sender.name} shared a file: ${document.fileName}`);
        if (originalOnNewDocument.document) originalOnNewDocument.document(document);
      };
    }
  }, [onNewMessage, onNewDocument]);

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <FaBell className="bell-icon" />
        <h3>Notifications</h3>
      </div>
      
      <div className="notification-list">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification-item ${notification.type || ''}`}>
            <div className="notification-icon">
              {notification.text.includes(':') ? <FaComment /> : <FaFileAlt />}
            </div>
            <div className="notification-text">
              {notification.text}
            </div>
            <button 
              className="dismiss-btn"
              onClick={() => dismissNotification(notification.id)}
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
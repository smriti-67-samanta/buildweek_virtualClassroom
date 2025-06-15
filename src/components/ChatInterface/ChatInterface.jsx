import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import '../../styles/dashboard.css';

const ChatInterface = ({ roomId, onNewMessage, onNewDocument }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Mock data for demonstration
  useEffect(() => {
    if (!roomId) return;
    
    const mockMessages = [
      {
        id: '1',
        content: 'Welcome to the chat!',
        sender: 'System',
        userId: 'system',
        timestamp: Date.now() - 3600000,
        type: 'text'
      },
      {
        id: '2',
        content: 'How can I help you today?',
        sender: 'Support',
        userId: 'support',
        timestamp: Date.now() - 1800000,
        type: 'text'
      },
      {
        id: '3',
        content: 'Can someone explain the homework?',
        sender: 'Alice',
        userId: 'user1',
        timestamp: Date.now() - 1200000,
        type: 'text'
      },
      {
        id: '4',
        content: 'Sure, I can help with that!',
        sender: 'Bob',
        userId: 'user2',
        timestamp: Date.now() - 900000,
        type: 'text'
      },
      {
        id: '5',
        content: 'Does anyone have the notes from last class?',
        sender: 'Charlie',
        userId: 'user3',
        timestamp: Date.now() - 600000,
        type: 'text'
      }
    ];
    
    setMessages(mockMessages);
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: currentUser?.displayName || 'You',
      userId: currentUser?.uid || 'guest',
      timestamp: Date.now(),
      type: 'text'
    };

    // Prepare the mock response
    const mockResponse = {
      id: (Date.now() + 1).toString(),
      content: "Thanks for your message! How can I assist you further?",
      sender: 'Support',
      userId: 'support',
      timestamp: Date.now() + 1000,
      type: 'text'
    };

    // Add both the user's message and the mock response in a single state update
    setMessages(prev => [...prev, userMessage, mockResponse]);
    setNewMessage('');

    // Trigger the onNewMessage callback for both messages
    if (onNewMessage) {
      onNewMessage(userMessage);
      onNewMessage(mockResponse);
    }
  };

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const addDocument = (document) => {
    const message = {
      id: Date.now().toString(),
      type: 'document',
      content: document,
      sender: currentUser?.displayName || 'You',
      userId: currentUser?.uid || 'guest',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, message]);
    
    if (onNewDocument) {
      onNewDocument(document);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'documents') return message.type === 'document';
    if (activeFilter === 'questions') return message.content.includes('?');
    return true;
  });

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Class Chat</h3>
        <div className="chat-filters">
          <button 
            className={activeFilter === 'all' ? 'active' : ''}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={activeFilter === 'documents' ? 'active' : ''}
            onClick={() => setActiveFilter('documents')}
          >
            Files
          </button>
          <button 
            className={activeFilter === 'questions' ? 'active' : ''}
            onClick={() => setActiveFilter('questions')}
          >
            Questions
          </button>
        </div>
      </div>

      <div className="messages-container">
        {filteredMessages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.userId === currentUser?.uid ? 'current-user' : ''}`}
          >
            {message.userId !== currentUser?.uid && (
              <div className="sender-name">{message.sender}</div>
            )}
            
            {message.type === 'document' ? (
              <div className="document-message">
                <a 
                  href={message.content.fileData} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download={message.content.fileName}
                >
                  📄 {message.content.fileName}
                </a>
              </div>
            ) : (
              <div className="text-message">{message.content}</div>
            )}
            
            <div className="timestamp">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatInterface;
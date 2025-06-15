import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaChalkboardTeacher, FaUsers, FaFileAlt, FaVideo, FaComments } from 'react-icons/fa';

const ClassroomView = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('video');

  const classroom = state?.classroom || {
    id,
    name: `Mock Classroom ${id}`,
    subject: 'Mock Subject',
    teacherName: 'Mock Teacher',
    description: 'This is a mock classroom for demonstration purposes.'
  };

  return (
    <div className="classroom-view">
      <div className="classroom-header">
        <h1>{classroom.name}</h1>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
      
      <div className="classroom-tabs">
        <button 
          className={activeTab === 'video' ? 'active' : ''}
          onClick={() => setActiveTab('video')}
        >
          <FaVideo /> Video
        </button>
        <button 
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          <FaComments /> Chat
        </button>
        <button 
          className={activeTab === 'documents' ? 'active' : ''}
          onClick={() => setActiveTab('documents')}
        >
          <FaFileAlt /> Documents
        </button>
      </div>
      
      <div className="classroom-content">
        {activeTab === 'video' && (
          <div className="video-container">
            <h2>Video Conference</h2>
            <p>Mock video interface would appear here</p>
            <div className="mock-video">
              <div className="teacher-video">
                <FaChalkboardTeacher size={48} />
                <p>{classroom.teacherName} (Teacher)</p>
              </div>
              <div className="students-video">
                <FaUsers size={48} />
                <p>Students Video Feeds</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'chat' && (
          <div className="chat-container">
            <h2>Class Chat</h2>
            <div className="mock-chat">
              <div className="chat-messages">
                <div className="message">
                  <strong>{classroom.teacherName}:</strong> Welcome to class!
                </div>
                <div className="message">
                  <strong>Student1:</strong> Hello everyone!
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="documents-container">
            <h2>Class Documents</h2>
            <div className="documents-list">
              <div className="document">
                <FaFileAlt /> Syllabus.pdf
              </div>
              <div className="document">
                <FaFileAlt /> Lecture_1.pptx
              </div>
              <div className="document">
                <FaFileAlt /> Assignment_1.docx
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomView;
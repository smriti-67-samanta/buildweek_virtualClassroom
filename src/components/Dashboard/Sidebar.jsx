import React from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaChalkboard, FaStickyNote } from 'react-icons/fa'; // Added FaStickyNote for Notes

export const Sidebar = ({ activeTab, setActiveTab, onWhiteboardClick }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Virtual Classroom</h3>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`sidebar-tab ${activeTab === 'my-classes' ? 'active' : ''}`}
          onClick={() => handleTabClick('my-classes')}
        >
          <FaUserGraduate /> My Classes
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'all-classes' ? 'active' : ''}`}
          onClick={() => handleTabClick('all-classes')}
        >
          <FaChalkboardTeacher /> All Classes
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => handleTabClick('schedule')}
        >
          <FaCalendarAlt /> Schedule
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'whiteboard' ? 'active' : ''}`}
          onClick={onWhiteboardClick}
        >
          <FaChalkboard /> Whiteboard
        </button>
      
      </nav>
    </div>
  );
};
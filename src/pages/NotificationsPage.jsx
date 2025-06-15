import React from 'react';
import { FaBell, FaComment, FaFileAlt, FaUserFriends, FaCalendarAlt, FaChalkboardTeacher } from 'react-icons/fa';
import '../styles/dashboard.css';

const NotificationsPage = () => {
  // Mock notifications data with unique IDs
  const notifications = [
    {
      id: 'notif-1',
      title: "Welcome to Virtual Classroom!",
      message: "Your account has been successfully activated.",
      time: "Today at 10:27 PM",
      icon: <FaBell className="icon-welcome" />
    },
    {
      id: 'notif-2',
      title: "New Classroom Created",
      message: "Computer Science 301 is now available.",
      time: "Today at 10:27 PM",
      icon: <FaChalkboardTeacher className="icon-classroom" />
    },
    {
      id: 'notif-3',
      title: "New Message",
      message: "Professor Smith sent you a direct message.",
      time: "Today at 9:45 PM",
      icon: <FaComment className="icon-message" />
    },
    {
      id: 'notif-4',
      title: "Document Shared",
      message: "Syllabus.pdf has been uploaded to your class.",
      time: "Yesterday at 3:30 PM",
      icon: <FaFileAlt className="icon-document" />
    },
    {
      id: 'notif-5',
      title: "New Classmate",
      message: "Alex Johnson joined your classroom.",
      time: "Monday at 11:20 AM",
      icon: <FaUserFriends className="icon-user" />
    }
  ];

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <FaBell className="header-icon" />
        <h1>Notifications</h1>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-card">
            <div className="notification-icon">
              {notification.icon}
            </div>
            <div className="notification-content">
              <h3 className="notification-title">{notification.title}</h3>
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
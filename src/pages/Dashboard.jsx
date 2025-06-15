import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar, ClassroomCard } from '../components/Dashboard';
import { Loader } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaClock, FaChalkboardTeacher, FaUserGraduate, FaCalendarWeek } from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('my-classes');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Mock data for classes
  const mockClassrooms = [
    {
      id: 'math101',
      name: 'Mathematics 101',
      subject: 'Mathematics',
      teacherName: 'Dr. Smith',
      teacherId: 'teacher1',
      schedule: { day: 'Monday', time: '09:00 - 10:30' },
      students: ['student1', 'student2'],
      description: 'Introduction to algebra and calculus'
    },
    {
      id: 'physics201',
      name: 'Physics 201',
      subject: 'Physics',
      teacherName: 'Prof. Johnson',
      teacherId: 'teacher2',
      schedule: { day: 'Wednesday', time: '11:00 - 12:30' },
      students: ['student1', 'student3'],
      description: 'Mechanics and thermodynamics'
    },
    {
      id: 'cs301',
      name: 'Computer Science 301',
      subject: 'Computer Science',
      teacherName: 'Dr. Williams',
      teacherId: 'teacher3',
      schedule: { day: 'Friday', time: '14:00 - 15:30' },
      students: ['student2', 'student3'],
      description: 'Data structures and algorithms'
    },
    // Updated mock data for classes with more schedule variety

  {
    id: 'math101',
    name: 'Mathematics 101',
    subject: 'Mathematics',
    teacherName: 'Dr. Smith',
    teacherId: 'teacher1',
    schedule: { day: 'Monday', time: '09:00 - 10:30' },
    students: ['student1', 'student2'],
    description: 'Introduction to algebra and calculus'
  },
  {
    id: 'math102',
    name: 'Mathematics 102',
    subject: 'Mathematics',
    teacherName: 'Dr. Smith',
    teacherId: 'teacher1',
    schedule: { day: 'Monday', time: '13:00 - 14:30' },
    students: ['student1', 'student3'],
    description: 'Advanced algebra concepts'
  },
  {
    id: 'physics201',
    name: 'Physics 201',
    subject: 'Physics',
    teacherName: 'Prof. Johnson',
    teacherId: 'teacher2',
    schedule: { day: 'Wednesday', time: '11:00 - 12:30' },
    students: ['student1', 'student3'],
    description: 'Mechanics and thermodynamics'
  },
  {
    id: 'physics202',
    name: 'Physics 202',
    subject: 'Physics',
    teacherName: 'Prof. Johnson',
    teacherId: 'teacher2',
    schedule: { day: 'Wednesday', time: '15:00 - 16:30' },
    students: ['student2', 'student4'],
    description: 'Electromagnetism'
  },
  {
    id: 'cs301',
    name: 'Computer Science 301',
    subject: 'Computer Science',
    teacherName: 'Dr. Williams',
    teacherId: 'teacher3',
    schedule: { day: 'Friday', time: '14:00 - 15:30' },
    students: ['student2', 'student3'],
    description: 'Data structures and algorithms'
  },
  {
    id: 'cs302',
    name: 'Computer Science 302',
    subject: 'Computer Science',
    teacherName: 'Dr. Williams',
    teacherId: 'teacher3',
    schedule: { day: 'Friday', time: '16:00 - 17:30' },
    students: ['student1', 'student4'],
    description: 'Database systems'
  },
  {
    id: 'bio101',
    name: 'Biology 101',
    subject: 'Biology',
    teacherName: 'Dr. Brown',
    teacherId: 'teacher4',
    schedule: { day: 'Tuesday', time: '10:00 - 11:30' },
    students: ['student2', 'student4'],
    description: 'Cell biology fundamentals'
  },
  {
    id: 'chem201',
    name: 'Chemistry 201',
    subject: 'Chemistry',
    teacherName: 'Dr. Davis',
    teacherId: 'teacher5',
    schedule: { day: 'Thursday', time: '09:30 - 11:00' },
    students: ['student1', 'student3'],
    description: 'Organic chemistry principles'
  },
  {
    id: 'chem202',
    name: 'Chemistry 202',
    subject: 'Chemistry',
    teacherName: 'Dr. Davis',
    teacherId: 'teacher5',
    schedule: { day: 'Thursday', time: '13:00 - 14:30' },
    students: ['student2', 'student4'],
    description: 'Inorganic chemistry'
  },
  {
    id: 'hist101',
    name: 'History 101',
    subject: 'History',
    teacherName: 'Prof. Wilson',
    teacherId: 'teacher6',
    schedule: { day: 'Tuesday', time: '14:00 - 15:30' },
    students: ['student1', 'student2', 'student3'],
    description: 'World history survey'
  },
  {
    id: 'eng201',
    name: 'English 201',
    subject: 'English',
    teacherName: 'Prof. Taylor',
    teacherId: 'teacher7',
    schedule: { day: 'Wednesday', time: '09:00 - 10:30' },
    students: ['student3', 'student4'],
    description: 'Literature analysis'
  },
  {
    id: 'art101',
    name: 'Art 101',
    subject: 'Art',
    teacherName: 'Prof. Martinez',
    teacherId: 'teacher8',
    schedule: { day: 'Friday', time: '10:00 - 12:00' },
    students: ['student1', 'student2', 'student4'],
    description: 'Introduction to visual arts'
  }
];
  

  const [classrooms, setClassrooms] = useState(mockClassrooms);
  const [loading, setLoading] = useState(false);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter classrooms based on active tab and user role
  const getFilteredClassrooms = () => {
    if (!currentUser) return [];
    
    if (activeTab === 'my-classes') {
      if (currentUser.role === 'teacher') {
        return classrooms.filter(classroom => classroom.teacherId === currentUser.uid);
      } else {
        return classrooms.filter(classroom => 
          classroom.students.includes(currentUser.uid)
        );
      }
    }
    return classrooms;
  };

  // CORRECTED THIS FUNCTION - Fixed toLocaleDateString
  const getTodaysClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return classrooms.filter(classroom => 
      classroom.schedule.day === today
    );
  };

  // Get weekly schedule grouped by day
  const getWeeklySchedule = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => ({
      day,
      classes: classrooms.filter(classroom => classroom.schedule.day === day)
    }));
  };

  const handleJoinClassroom = (classroomId) => {
    navigate(`/classroom/${classroomId}`, {
      state: {
        classroom: classrooms.find(c => c.id === classroomId)
      }
    });
  };

  if (loading) {
    return <Loader />;
  }

  const todaysClasses = getTodaysClasses();
  const filteredClassrooms = getFilteredClassrooms();
  const weeklySchedule = getWeeklySchedule();

  return (
    <div className="dashboard-container">
      <Navbar user={currentUser} isMobile={isMobile} />
      
      <div className="dashboard-content">
        {!isMobile && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
        
        <main className="dashboard-main">
          {activeTab === 'schedule' ? (
            <div className="weekly-schedule-view">
              <h2 className="section-title">
                <FaCalendarWeek /> Weekly Class Schedule
              </h2>
              {weeklySchedule.map(({ day, classes }) => (
                <div key={day} className="day-schedule">
                  <h3>{day}</h3>
                  {classes.length > 0 ? (
                    <div className="classes-grid">
                      {classes.map(classroom => (
                        <div key={classroom.id} className="class-card">
                          <h4>{classroom.name}</h4>
                          <p className="class-meta">
                            <FaClock /> {classroom.schedule.time} • {classroom.subject}
                          </p>
                          <button 
                            className="join-btn"
                            onClick={() => handleJoinClassroom(classroom.id)}
                          >
                            Join Class
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-classes">No classes scheduled</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Today's Schedule Section */}
              <div className="section-card">
                <h2 className="section-title">
                  <FaCalendarAlt /> Today's Classes ({new Date().toLocaleDateString('en-US', { weekday: 'long' })})
                </h2>
                {todaysClasses.length > 0 ? (
                  <div className="classes-grid">
                    {todaysClasses.map(classroom => (
                      <div key={classroom.id} className="class-card">
                        <h3>{classroom.name}</h3>
                        <p className="class-meta">
                          <FaClock /> {classroom.schedule.time} • {classroom.subject}
                        </p>
                        <button 
                          className="join-btn"
                          onClick={() => handleJoinClassroom(classroom.id)}
                        >
                          Join Class
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No classes scheduled for today.</p>
                  </div>
                )}
              </div>

              {/* Classroom List Section */}
              <div className="section-card">
                <div className="section-header">
                  <h2 className="section-title">
                    {activeTab === 'my-classes' ? <FaUserGraduate /> : <FaChalkboardTeacher />}
                    {activeTab === 'my-classes' ? ' My Classes' : ' All Classes'}
                  </h2>
                  {currentUser?.role === 'teacher' && (
                    <button 
                      className="create-btn"
                      onClick={() => navigate('/create-classroom')}
                    >
                      + Create Classroom
                    </button>
                  )}
                </div>
                
                {filteredClassrooms.length > 0 ? (
                  <div className="classes-grid">
                    {filteredClassrooms.map(classroom => (
                      <ClassroomCard
                        key={classroom.id}
                        classroom={classroom}
                        onJoin={() => handleJoinClassroom(classroom.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No classrooms available.</p>
                    {currentUser?.role === 'teacher' && (
                      <button 
                        className="create-btn"
                        onClick={() => navigate('/create-classroom')}
                      >
                        + Create Your First Classroom
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="mobile-nav">
          <button 
            className={activeTab === 'my-classes' ? 'active' : ''}
            onClick={() => setActiveTab('my-classes')}
          >
            <FaUserGraduate /> My Classes
          </button>
          <button 
            className={activeTab === 'all-classes' ? 'active' : ''}
            onClick={() => setActiveTab('all-classes')}
          >
            <FaChalkboardTeacher /> All Classes
          </button>
          <button 
            className={activeTab === 'schedule' ? 'active' : ''}
            onClick={() => setActiveTab('schedule')}
          >
            <FaCalendarWeek /> Schedule
          </button>
          <button 
             className="join-btn"
            onClick={() => navigate(`/classroom/${classroom.id}`, {
            state: { classroom } // Pass the classroom data
              })}
              >
             Join Class
           </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


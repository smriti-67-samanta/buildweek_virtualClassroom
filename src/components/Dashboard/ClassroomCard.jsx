import React from 'react';

const ClassroomCard = ({ classroom, onJoin, onVideoJoin, onChatJoin, isTeacher }) => {
  return (
    <div className="classroom-card">
      <div className="card-header">
        <h3>{classroom.name}</h3>
      </div>
      <div className="card-body">
        <p className="subject">{classroom.subject}</p>
        <p className="description">{classroom.description}</p>
        <div className="card-meta">
          <span>Teacher: {classroom.teacherName}</span>
          <span>Students: {classroom.students?.length || 0}</span>
        </div>
      </div>
      <div className="card-footer">
        {isTeacher ? (
          <button className="manage-btn" onClick={onJoin}>
            Manage
          </button>
        ) : (
          <button className="join-btn" onClick={onJoin}>
            Join
          </button>
        )}
        <button className="join-btn" onClick={onVideoJoin}>
          Join Video
        </button>
        <button className="join-btn" onClick={onChatJoin}>
          Join Chat
        </button>
      </div>
    </div>
  );
};

export { ClassroomCard };


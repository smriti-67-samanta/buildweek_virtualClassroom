import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { database } from '../../firebase';
import { ref, push } from 'firebase/database';
import '../../styles/dashboard.css';

const CreateClassroom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is a teacher
  if (user?.role !== 'teacher') {
    return (
      <div className="dashboard-container">
        <div className="dashboard-main">
          <h2>Access Denied</h2>
          <p>Only teachers can create classrooms.</p>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject) {
      setError('Name and subject are required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const classroomsRef = ref(database, 'classrooms');
      await push(classroomsRef, {
        name: formData.name,
        subject: formData.subject,
        description: formData.description,
        teacherId: user.uid,
        teacherName: user.name,
        students: [],
        createdAt: Date.now()
      });

      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create classroom. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="create-classroom-container">
      <h2>Create a New Classroom</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="create-classroom-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Classroom Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter classroom name"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description (optional)"
            rows="4"
            disabled={loading}
          />
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Classroom'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassroom;
import { useState } from 'react';
import axios from 'axios';
import './AddTask.css';

const URI = import.meta.env.VITE_API_URL;

export default function AddTask({ onTaskCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleForm = () => setShowForm(!showForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${URI}/api/tasks/add`,
        { title, description, completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Task added successfully!');
      setTitle('');
      setDescription('');
      setCompleted(false);
      if (onTaskCreated) onTaskCreated(response.data);

      setTimeout(() => {
        setShowForm(false); // close after a success
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-custom" onClick={toggleForm}>
          ➕ Add Task
        </button>
      </div>

{showForm && (
        <div className="modern-modal-overlay">
          <div className="modern-modal-container">
            <div className="modal-header">
              <h4 className="modal-title">Create New Task</h4>
              <button
                className="modern-close-button"
                onClick={toggleForm}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="modern-alert error">
                  <span className="alert-icon">⚠️</span>
                  {error}
                </div>
              )}
              {success && (
                <div className="modern-alert success">
                  <span className="alert-icon">✅</span>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-group">
                  <label className="modern-label">Task Title</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="modern-label">Description</label>
                  <textarea
                    className="modern-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your task..."
                    rows={4}
                    required
                  ></textarea>
                </div>

                <div className="checkbox-group">
                  <label className="modern-checkbox-container">
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={(e) => setCompleted(e.target.checked)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-checkmark"></span>
                    <span className="checkbox-label">Mark as completed</span>
                  </label>
                </div>

                <button type="submit" className="modern-submit-button">
                  <span className="submit-icon">🚀</span>
                  Create Task
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
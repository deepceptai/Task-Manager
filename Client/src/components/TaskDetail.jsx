import { useEffect, useState } from 'react';
import './TaskDetails.css'
import axios from 'axios';
import EditTask from './EditTask';
import DeleteTask from './DeleteTask';

const URI = import.meta.env.VITE_API_URL;

export default function TaskDetail({ taskId, onClose, onTaskUpdated, onTaskDeleted }) {
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${URI}/api/tasks/fetch-single/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data);
      } catch (err) {
        setError('Failed to fetch task details');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [taskId]);

  const handleTaskUpdate = (updatedTask) => {
    setTask(updatedTask);
    onTaskUpdated?.(updatedTask);
    setIsEditing(false);
  };

  const handleTaskDelete = () => {
    onTaskDeleted?.(taskId);
    onClose?.();
  };

  if (!taskId) return null;

  if (isEditing && task) {
    return (
      <EditTask
        task={task}
        onClose={() => setIsEditing(false)}
        onTaskUpdated={handleTaskUpdate}
      />
    );
  }

  return (
    <>
      <div className="modern-modal-overlay" onClick={onClose}>
        <div 
          className="modern-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h4 className="modal-title">{task?.title || 'Task Details'}</h4>
            <button 
              className="modern-close-button"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            {loading ? (
              <div className="loading-container">
                <div className="modern-spinner"></div>
                <p className="loading-text">Loading task details...</p>
              </div>
            ) : error ? (
              <div className="modern-alert error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            ) : (
              <div className="task-details">
                <div className="detail-section">
                  <h5 className="section-title">Description</h5>
                  <p className="task-description">
                    {task?.description || 'No description provided'}
                  </p>
                </div>

                <div className="detail-section">
                  <h5 className="section-title">Status</h5>
                  <span className={`modern-badge ${task?.completed ? 'completed' : 'pending'}`}>
                    <span className="badge-icon">
                      {task?.completed ? '✅' : '⏳'}
                    </span>
                    {task?.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>

                <div className="detail-section">
                  <h5 className="section-title">Last Updated</h5>
                  <p className="update-time">
                    {task ? new Date(task.updatedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {task && (
              <>
                <button 
                  className="modern-action-button edit" 
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  <span className="button-icon">✏️</span>
                  Edit
                </button>
                <DeleteTask 
                  taskId={taskId} 
                  onDeleted={handleTaskDelete}
                />
              </>
            )}
            <button 
              className="modern-action-button secondary" 
              onClick={onClose}
              disabled={loading}
            >
              <span className="button-icon">↩️</span>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
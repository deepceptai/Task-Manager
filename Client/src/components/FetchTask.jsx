import { useState, useEffect } from 'react';
import './FetchTask.css'; // External CSS
import TaskDetail from './TaskDetail';

export default function FetchTask({ tasks: initialTasks, loading, error }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskList, setTaskList] = useState(initialTasks);

  useEffect(() => {
    setTaskList(initialTasks);
  }, [initialTasks]);

  const handleCloseModal = () => setSelectedTaskId(null);

  const handleTaskUpdated = (updatedTask) => {
    const updatedList = taskList.map(task =>
      task._id === updatedTask._id ? updatedTask : task
    );
    setTaskList(updatedList);
  };

  const handleTaskDeleted = (deletedTaskId) => {
    const updatedList = taskList.filter(task => task._id !== deletedTaskId);
    setTaskList(updatedList);
    setSelectedTaskId(null);
  };

  return (
    <div className="">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Loading your tasks...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-message">{error}</div>
        </div>
      ) : taskList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
        </div>
      ) : (
        <>
          <div className="task-header">
            <h2>Your Tasks</h2>
            <div className="task-stats">
              <span className="stat completed">
                {taskList.filter(task => task.completed).length} Completed
              </span>
              <span className="stat pending">
                {taskList.filter(task => !task.completed).length} Pending
              </span>
            </div>
          </div>

          <div className="modern-accordion" id="tasksAccordion">
            {taskList.map((task, index) => (
              <div className="modern-accordion-item" key={task._id}>
                <h2 className="modern-accordion-header" id={`heading-${index}`}>
                  <button
                    className={`modern-accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-expanded={index === 0 ? 'true' : 'false'}
                    aria-controls={`collapse-${index}`}
                    onClick={() => setSelectedTaskId(task._id)}
                  >
                    <div className="accordion-content">
                      <div className="task-info">
                        <div className={`task-status ${task.completed ? 'completed' : 'pending'}`}></div>
                        <span className="task-title">{task.title}</span>
                      </div>
                      <span className={`modern-badge ${task.completed ? 'success' : 'warning'}`}>
                        {task.completed ? '✓ Completed' : '⏳ Pending'}
                      </span>
                    </div>
                  </button>
                </h2>
                <div
                  id={`collapse-${index}`}
                  className={`modern-accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                  aria-labelledby={`heading-${index}`}
                  data-bs-parent="#tasksAccordion"
                >
                  <div className="modern-accordion-body">
                    <p className="task-description">{task.description}</p>
                    <div className="task-meta">
                      <span className="created-date">
                        📅 Created: {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedTaskId && (
            <TaskDetail
              taskId={selectedTaskId}
              onClose={handleCloseModal}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          )}
        </>
      )}
    </div>
  );
}

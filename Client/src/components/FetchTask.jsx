import { useState, useEffect } from 'react';
import './FetchTask.css';
import TaskDetail from './TaskDetail';

export default function FetchTask({ tasks: initialTasks, loading, error }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskList, setTaskList] = useState(initialTasks);

  // Sync local state when parent tasks change
  useEffect(() => {
    setTaskList(initialTasks);
  }, [initialTasks]);

  const handleCloseModal = () => setSelectedTaskId(null);

  const handleTaskUpdated = (updatedTask) => {
    const updatedList = taskList.map(task =>
      task._id === updatedTask._id ? updatedTask : task
    );
    setTaskList(updatedList); // Update local state
  };

  // Add this to your FetchTask component
const handleTaskDeleted = (deletedTaskId) => {
  const updatedList = taskList.filter(task => task._id !== deletedTaskId);
  setTaskList(updatedList);
  setSelectedTaskId(null); // Close modal if open
};

  return (
    <div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : taskList.length === 0 ? (
        <div className="alert alert-info text-center">No tasks found.</div>
      ) : (
        <>
          <div className="accordion" id="tasksAccordion">
            {taskList.map((task, index) => (
              <div className="accordion-item" key={task._id}>
                <h2 className="accordion-header" id={`heading-${index}`}>
                  <button
                    className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-expanded={index === 0 ? 'true' : 'false'}
                    aria-controls={`collapse-${index}`}
                    onClick={() => setSelectedTaskId(task._id)}
                  >
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <span>{task.title}</span>
                      <span
                        className={`badge ${
                          task.completed ? 'bg-success' : 'bg-warning text-dark'
                        }`}
                      >
                        {task.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </button>
                </h2>
                <div
                  id={`collapse-${index}`}
                  className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                  aria-labelledby={`heading-${index}`}
                  data-bs-parent="#tasksAccordion"
                >
                  <div className="accordion-body">
                    <p>{task.description}</p>
                    <small className="text-muted">
                      Created on: {new Date(task.createdAt).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for task details */}
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
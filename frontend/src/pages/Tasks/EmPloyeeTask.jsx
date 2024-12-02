import React, { useEffect, useState } from "react";
import { fetchTasksForEmployee } from "../../services/api"; // Import the API function
import Modal from "../Model/Modal"; // Import Modal component
import "./EmployeeTasks.css";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // Task to show in modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setError(null);
        setLoading(true);
        const fetchedTasks = await fetchTasksForEmployee();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err.message);
        setError("Failed to fetch tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleMoreDetails = (task) => {
    setSelectedTask(task); // Set the selected task
    setIsModalOpen(true); // Open modal
  };

  if (loading) return <div className="tasks-loading">Loading tasks...</div>;
  if (error) return <div className="tasks-error">{error}</div>;

  return (
    <div className="tasks-container">
      <h2 className="tasks-title">My Tasks</h2>
      {tasks.length > 0 ? (
        <ul className="tasks-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <h3 className="task-name">{task.name}</h3>
              <p className="task-deadline">
                <strong>Deadline:</strong>{" "}
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
              </p>
              <p className="task-status">
                <strong>Status:</strong> {task.status || "Not specified"}
              </p>
              <button
                className="more-details-button"
                onClick={() => handleMoreDetails(task)}
              >
                More Details
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="tasks-empty">No tasks assigned.</p>
      )}

      {/* Modal for More Details */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedTask && (
          <div className="task-details">
            <h3 className="task-name">{selectedTask.name}</h3>
            <p className="task-description">
              <strong>Description:</strong> {selectedTask.description}
            </p>
            <p className="task-deadline">
              <strong>Deadline:</strong>{" "}
              {selectedTask.deadline
                ? new Date(selectedTask.deadline).toLocaleDateString()
                : "No deadline"}
            </p>
            <p className="task-status">
              <strong>Status:</strong> {selectedTask.status || "Not specified"}
            </p>
            <p className="task-priority">
              <strong>Priority:</strong> {selectedTask.priority || "Not specified"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeTasks;

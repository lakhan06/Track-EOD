import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import {
  fetchTasksForCompany,
  fetchEmployeesForCompany,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/api";
import Modal from "../Model/Modal";
import "./Task.css";

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    deadline: "",
    assignees: [],
  });
  const [editTask, setEditTask] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) return;
      try {
        const [tasksResponse, employeesResponse] = await Promise.all([
          fetchTasksForCompany(user.id),
          fetchEmployeesForCompany(user.id),
          

        ]);
        setTasks(tasksResponse.data || []);
        setEmployees(employeesResponse.data.employees || []);
      } catch (err) {
        console.error("Failed to fetch data:", err.message);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await createTask({ ...newTask, companyId: user.id });
      const createdTask = response.data;
      

      const { data } = await fetchTasksForCompany(user.id);
      setTasks(Array.isArray(data) ? data : []);
      setNewTask({ name: "", description: "", deadline: "", assignees: [] });
    } catch (err) {
      console.error("Error creating task:", err.message || err.response?.data?.message);
      setError("Failed to create task.");
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateTask(editTask._id, editTask);
      setTasks(tasks.map((task) => (task._id === data.task._id ? data.task : task)));
      setEditTask(null);
      setIsEditModalOpen(false);
    } catch (err) {
      setError("Failed to update task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      setError("Failed to delete task.");
    }
  };

  if (loading) return <div className="tasks-loading">Loading tasks...</div>;

  return (
    <div className="tasks-container">
      {/* <h2 className="tasks-title">Task Management</h2> */}

      <div className="tasks-create">
        <h4>Create Task</h4>
        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter task name"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-input"
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              className="form-input"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              required
            />
          </div>
          <div className="register-form-group">
            <label>Select Employee</label>
            <select
              className="register-form-control"
              value={newTask.assignees}
              onChange={(e) => {
        const selectedEmployees = Array.from(e.target.selectedOptions, (option) => option.value);
        setNewTask({ ...newTask, assignees: selectedEmployees });
      }}
              required
            >
              <option value="">-- Select Employees --</option>
              {employees.length > 0 ? (
        employees.map((employee) => (
          <option key={employee._id} value={employee._id}>
            {employee.username}
          </option>
        ))
      ) : (
        <option disabled>No employees available</option>
      )}
            </select>
          </div>
          


          <button type="submit" className="btn-submit">Create Task</button>
        </form>
      </div>

      <div className="tasks-list">
        <h4>Tasks</h4>
        {tasks.length > 0 ? (
          <ul className="tasks-ul">
            {tasks.map((task) => (
              <li key={task._id} className="tasks-li">
                <div>
                  <strong>{task.name}</strong>
                  <p>{task.description}</p>
                  <small>
                    Deadline:{" "}
                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                  </small>
                  <p>
                    Assigned To:{" "}
                    {task.assignees
                      ?.map((assignee) => {
                        
                        return  assignee.username;
                      })
                      .join(", ")}
                  </p>
                </div>
                <div>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditTask(task);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks available</p>
        )}
      </div>

      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <h4>Edit Task</h4>
          <form onSubmit={handleUpdateTask}>
            <div className="form-group">
              <label>Task Name</label>
              <input
                type="text"
                className="form-input"
                value={editTask?.name || ""}
                onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input"
                value={editTask?.description || ""}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                className="form-input"
                value={editTask?.deadline?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditTask({ ...editTask, deadline: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Assign To</label>
              <select
                multiple
                className="form-input"
                value={editTask?.assignees || []}
                onChange={(e) =>
                  setEditTask({
                    ...editTask,
                    assignees: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
              >
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.username}
                    </option>
                  ))
                ) : (
                  <option disabled>No employees available</option>
                )}
              </select>
            </div>
            <button type="submit" className="btn-submit">Save Changes</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Tasks;

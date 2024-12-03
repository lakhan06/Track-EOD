import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { createProjectWithTasksAndWorks, fetchEmployeesForCompany } from "../../services/api";
import "./ProjectForm.css";

const ProjectForm = () => {
  const { user } = useContext(AuthContext); // Access the authenticated user
  const [project, setProject] = useState({
    name: "",
    description: "",
    deadline: "",
    tasks: [
      {
        name: "",
        description: "",
        deadline: "",
        works: [
          { name: "", description: "", deadline: "", assignees: [] },
        ],
      },
    ],
  });

  const [employees, setEmployees] = useState([]); // List of employees for the company
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [collapsedTasks, setCollapsedTasks] = useState([true]); // State for task visibility
  const [collapsedWorks, setCollapsedWorks] = useState([[true]]); // State for work visibility

  // Fetch employees for the company
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user || !user.id) return;

      try {
        const response = await fetchEmployeesForCompany(user.id);
        setEmployees(response.data.employees || []);
      } catch (err) {
        console.error("Error fetching employees:", err.message);
      }
    };

    fetchEmployees();
  }, [user]);

  const handleProjectChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleTaskChange = (index, e) => {
    const tasks = [...project.tasks];
    tasks[index][e.target.name] = e.target.value;
    setProject({ ...project, tasks });
  };

  const handleWorkChange = (taskIndex, workIndex, e) => {
    const tasks = [...project.tasks];
    tasks[taskIndex].works[workIndex][e.target.name] = e.target.value;
    setProject({ ...project, tasks });
  };

  const handleAssigneeChange = (taskIndex, workIndex, e) => {
    const tasks = [...project.tasks];
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    tasks[taskIndex].works[workIndex].assignees = selectedOptions;
    setProject({ ...project, tasks });
  };

  const addTask = () => {
    setProject({
      ...project,
      tasks: [...project.tasks, { name: "", description: "", deadline: "", works: [] }],
    });
    setCollapsedTasks([...collapsedTasks, true]);
    setCollapsedWorks([...collapsedWorks, []]);
  };

  const addWork = (taskIndex) => {
    const tasks = [...project.tasks];
    tasks[taskIndex].works.push({ name: "", description: "", deadline: "", assignees: [] });
    setProject({ ...project, tasks });

    const works = [...collapsedWorks];
    works[taskIndex] = [...works[taskIndex], true];
    setCollapsedWorks(works);
  };

  const removeTask = (taskIndex) => {
    const tasks = project.tasks.filter((_, index) => index !== taskIndex);
    setProject({ ...project, tasks });

    const collapsed = collapsedTasks.filter((_, index) => index !== taskIndex);
    setCollapsedTasks(collapsed);

    const works = collapsedWorks.filter((_, index) => index !== taskIndex);
    setCollapsedWorks(works);
  };

  const removeWork = (taskIndex, workIndex) => {
    const tasks = [...project.tasks];
    tasks[taskIndex].works = tasks[taskIndex].works.filter((_, index) => index !== workIndex);
    setProject({ ...project, tasks });

    const works = [...collapsedWorks];
    works[taskIndex] = works[taskIndex].filter((_, index) => index !== workIndex);
    setCollapsedWorks(works);
  };

  const toggleTaskCollapse = (taskIndex) => {
    const collapsed = [...collapsedTasks];
    collapsed[taskIndex] = !collapsed[taskIndex];
    setCollapsedTasks(collapsed);
  };

  const toggleWorkCollapse = (taskIndex, workIndex) => {
    const works = [...collapsedWorks];
    works[taskIndex][workIndex] = !works[taskIndex][workIndex];
    setCollapsedWorks(works);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await createProjectWithTasksAndWorks(project);
      setSuccess("Project created successfully!");
      console.log("Project created successfully:", response);
      setProject({
        name: "",
        description: "",
        deadline: "",
        tasks: [
          {
            name: "",
            description: "",
            deadline: "",
            works: [
              { name: "", description: "", deadline: "", assignees: [] },
            ],
          },
        ],
      });
      setCollapsedTasks([true]);
      setCollapsedWorks([[true]]);
    } catch (error) {
      setError("Error creating project. Please check your inputs.");
      console.error("Error creating project:", error);
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h1 className="project-form__title">Create Project</h1>

      {success && <p className="project-form__success-message">{success}</p>}
      {error && <p className="project-form__error-message">{error}</p>}

      <div className="project-form__group">
        <label>Project Name</label>
        <input
          type="text"
          name="name"
          value={project.name}
          onChange={handleProjectChange}
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="project-form__group">
        <label>Project Description</label>
        <textarea
          name="description"
          value={project.description}
          onChange={handleProjectChange}
          placeholder="Enter project description"
          required
        />
      </div>

      <div className="project-form__group">
        <label>Deadline</label>
        <input
          type="date"
          name="deadline"
          value={project.deadline}
          onChange={handleProjectChange}
          required
        />
      </div>

      {project.tasks.map((task, taskIndex) => (
        <div key={taskIndex} className="project-form__task-container">
          <h2
            onClick={() => toggleTaskCollapse(taskIndex)}
            className="project-form__toggle-header"
          >
            Task {taskIndex + 1} {collapsedTasks[taskIndex] ? "▼" : "▲"}
          </h2>
          {!collapsedTasks[taskIndex] && (
            <>
              <div className="project-form__group">
                <label>Task Name</label>
                <input
                  type="text"
                  name="name"
                  value={task.name}
                  onChange={(e) => handleTaskChange(taskIndex, e)}
                  placeholder="Enter task name"
                  required
                />
              </div>

              <div className="project-form__group">
                <label>Task Description</label>
                <textarea
                  name="description"
                  value={task.description}
                  onChange={(e) => handleTaskChange(taskIndex, e)}
                  placeholder="Enter task description"
                  required
                />
              </div>

              <div className="project-form__group">
                <label>Task Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={task.deadline}
                  onChange={(e) => handleTaskChange(taskIndex, e)}
                  required
                />
              </div>

              {task.works.map((work, workIndex) => (
                <div key={workIndex} className="project-form__work-container">
                  <h3
                    onClick={() => toggleWorkCollapse(taskIndex, workIndex)}
                    className="project-form__toggle-header"
                  >
                    Work {workIndex + 1} {collapsedWorks[taskIndex][workIndex] ? "▼" : "▲"}
                  </h3>
                  {!collapsedWorks[taskIndex][workIndex] && (
                    <>
                      <div className="project-form__group">
                        <label>Work Name</label>
                        <input
                          type="text"
                          name="name"
                          value={work.name}
                          onChange={(e) => handleWorkChange(taskIndex, workIndex, e)}
                          placeholder="Enter work name"
                          required
                        />
                      </div>

                      <div className="project-form__group">
                        <label>Work Description</label>
                        <textarea
                          name="description"
                          value={work.description}
                          onChange={(e) => handleWorkChange(taskIndex, workIndex, e)}
                          placeholder="Enter work description"
                          required
                        />
                      </div>

                      <div className="project-form__group">
                        <label>Work Deadline</label>
                        <input
                          type="date"
                          name="deadline"
                          value={work.deadline}
                          onChange={(e) => handleWorkChange(taskIndex, workIndex, e)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Assign Employee</label>
                        <select
                          className="form-input"
                          value={work.assignees}
                          onChange={(e) => handleAssigneeChange(taskIndex, workIndex, e)}
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

                      <button
                        type="button"
                        className="project-form__button project-form__button--remove"
                        onClick={() => removeWork(taskIndex, workIndex)}
                      >
                        Remove Work
                      </button>
                    </>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="project-form__button"
                onClick={() => addWork(taskIndex)}
              >
                Add Work
              </button>
              <button
                type="button"
                className="project-form__button project-form__button--remove"
                onClick={() => removeTask(taskIndex)}
              >
                Remove Task
              </button>
            </>
          )}
        </div>
      ))}

      <button type="button" className="project-form__button" onClick={addTask}>
        Add Task
      </button>
      <button type="submit" className="project-form__button project-form__button--submit">
        Submit
      </button>
    </form>
  );
};

export default ProjectForm;

const Task = require("../models/taskModel");
const { sendNotification } = require("../utils/notification");

const createTask = async (req, res) => {
  const { name, description, assignees, deadline } = req.body;

  try {
    // Extract companyId from authenticated user
    const companyId = req.user.id;

    // Ensure the requester is a company
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Only companies can create tasks" });
    }

    // Create and save the task
    const task = new Task({ name, description, companyId, assignees, deadline });
    await task.save();

    // Notify all assigned employees
    await Promise.all(
      assignees.map((employeeId) =>
        sendNotification(
          employeeId,
          `You have been assigned a new task: "${name}".`,
          { taskId: task._id, companyId }
        )
      )
    );

    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getTasksForCompany = async (req, res) => {
  const { companyId } = req.params;

  try {
    const tasks = await Task.find({ companyId }).populate("assignees", "username email");
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getTasksForEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const tasks = await Task.find({ assignees: employeeId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body; // Contains the fields to be updated

  try {
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const oldAssignees = task.assignees.map((id) => id.toString()); // Existing assignees

    // Validate and update specific fields if they exist in the request body
    if (updates.name) task.name = updates.name;
    if (updates.description) task.description = updates.description;
    if (updates.assignees) task.assignees = updates.assignees;
    if (updates.deadline) task.deadline = new Date(updates.deadline);
    if (updates.status) {
      if (!["Not Started", "In Progress", "Completed"].includes(updates.status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      task.status = updates.status;
    }

    // Save the updated task
    task.updatedAt = new Date();
    const updatedTask = await task.save();

    // Notify new assignees
    const newAssignees = updates.assignees?.map((id) => id.toString()) || [];
    const newlyAssigned = newAssignees.filter((id) => !oldAssignees.includes(id));

    await Promise.all(
      newlyAssigned.map((employeeId) =>
        sendNotification(
          employeeId,
          `You have been assigned to the updated task: "${task.name}".`,
          { taskId: task._id, companyId: task.companyId }
        )
      )
    );

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const assignees = task.assignees;

    // Delete the task
    await task.remove();

    // Notify all assignees about the deletion
    await Promise.all(
      assignees.map((employeeId) =>
        sendNotification(
          employeeId,
          `The task "${task.name}" has been deleted.`,
          { taskId, companyId: task.companyId }
        )
      )
    );

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { createTask, getTasksForCompany , getTasksForEmployee, updateTask ,deleteTask };

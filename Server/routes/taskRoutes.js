const express = require("express");
const {
  createTask,
  getTasksForCompany,
  getTasksForEmployee,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const auth = require("../middlewares/auth");
const router = express.Router();

// Create a new task
router.post("/create", auth(["company", "admin"]), createTask);

// Get tasks assigned by a specific company
router.get("/company/:companyId", auth(["company", "admin"]), getTasksForCompany);

// Get tasks assigned to a specific employee
router.get("/employee", auth(["employee", "admin", "company"]), getTasksForEmployee);

// Update task status
router.patch("/:taskId", auth(["employee", "company", "admin"]), updateTask);

// Delete a task
router.delete("/:taskId", auth(["company", "admin"]), deleteTask);

module.exports = router;

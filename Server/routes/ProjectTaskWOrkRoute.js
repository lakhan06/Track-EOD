const express = require("express");
const { createProjectWithTasksAndWorks } = require("../controllers/ProjectTaskWorkController");
const router = express.Router();
const auth = require("../middlewares/auth");

router.post("/projects-with-tasks",auth(["company"]), createProjectWithTasksAndWorks);

module.exports = router;

const mongoose = require("mongoose");
const Project = require("../models/ProjectModel");
const Task = require("../models/taskModel");
const Work = require("../models/WorkModel");

const createProjectWithTasksAndWorks = async (req, res) => {
  const { name, description, deadline, tasks } = req.body; // Expect tasks and works in the request body
  const companyId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Create the Project
    const project = new Project({
      name,
      description,
      deadline,
      companyId,
    });

    await project.save({ session });

    // Step 2: Create Tasks and Works
    for (const taskData of tasks) {
      const task = new Task({
        name: taskData.name,
        description: taskData.description,
        deadline: taskData.deadline,
        companyId,
        projectId: project._id,
      });

      await task.save({ session });

      // Step 3: Create Works for Each Task
      for (const workData of taskData.works) {
        const work = new Work({
          name: workData.name,
          description: workData.description,
          deadline: workData.deadline,
          assignees: workData.assignees,
          companyId,
          taskId: task._id,
        });

        await work.save({ session });
        task.works.push(work._id); // Add work to task's works array
      }

      await task.save({ session }); // Save task with works
      project.tasks.push(task._id); // Add task to project's tasks array
    }

    await project.save({ session }); // Save project with tasks
    await session.commitTransaction();

    res.status(201).json({ message: "Project, tasks, and works created successfully", data: project });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

module.exports = { createProjectWithTasksAndWorks };

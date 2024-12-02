const EodEntry = require("../models/EodEntryModel");
// const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const { sendNotification } = require("../utils/notification");

const submitEod = async (req, res) => {
  const { eodTitle,workDescription, mediaFiles } = req.body;
  const employeeId = req.user.id;

  try {
    // Find the user
    const user = await User.findById(employeeId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure the user is an employee
    if (user.role !== "employee") {
      return res.status(400).json({ message: "EOD submissions are only allowed for employees" });
    }

    // Check if an EOD already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to the start of the day

    const existingEod = await EodEntry.findOne({
      employeeId,
      submissionDate: { $gte: today },
    });

    if (existingEod) {
      return res.status(400).json({ message: "You have already submitted an EOD today." , existingEod});
    }

    // Update streak logic for employees
    const lastEodDate = user.employeeDetails.lastEodDate
      ? new Date(user.employeeDetails.lastEodDate)
      : null;
    const differenceInDays = lastEodDate ? (today - lastEodDate) / (1000 * 60 * 60 * 24) : null;

    if (differenceInDays !== null && differenceInDays <= 1) {
      // Increment streak if the last submission was yesterday
      user.employeeDetails.streakCount += 1;
    } else {
      // Reset streak if the last submission was not yesterday
      user.employeeDetails.streakCount = 1;
    }

    // Update longest streak
    if (user.employeeDetails.streakCount > user.employeeDetails.longestStreak) {
      user.employeeDetails.longestStreak = user.employeeDetails.streakCount;
    }

    // Update lastEodDate
    user.employeeDetails.lastEodDate = today;
    await user.save();
    // Create a new EOD entry
    const eod = new EodEntry({
      employeeId,
      eodTitle,
      workDescription,
      mediaFiles,
      submissionDate: new Date(),
    });
    await eod.save();

    // Notify the company
    await sendNotification(
      user.employeeDetails.companyId,
      `EOD submitted by ${user.username}: "${workDescription}"`,
      { eodId: eod._id, employeeId }
    );

    res.status(201).json({
      message: "EOD submitted successfully",
      eod,
      eodTitle,
      streakCount: user.employeeDetails.streakCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update EOD
const updateEod = async (req, res) => {
  const { eodId } = req.params;
  const { workDescription, mediaFiles, status } = req.body;

  try {
    // Find the EOD entry
    const eod = await EodEntry.findById(eodId);
    if (!eod) {
      return res.status(404).json({ message: "EOD entry not found" });
    }

    // Find the employee who updated the EOD
    const employee = await User.findById(eod.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update fields if provided in the request body
    if (workDescription) eod.workDescription = workDescription;
    if (mediaFiles) eod.mediaFiles = mediaFiles;
    if (status) {
      if (!["Pending", "Reviewed", "Approved"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      eod.status = status;
    }

    // Save the updated EOD entry
    const updatedEod = await eod.save();

    // Notify the company
    const message = `${employee.username} has updated their EOD.`;
    await sendNotification(eod.companyId, message, {
      eodId: eod._id,
      employeeId: eod.employeeId,
    });

    res.status(200).json({
      message: "EOD entry updated successfully",
      eod: updatedEod,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateEodFeedbackAndStatus = async (req, res) => {
  const { eodId } = req.params;
  const { feedback, status } = req.body;

  try {
    // Validate status input
    if (status && !["Pending", "Reviewed", "Approved", "NotApproved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the EOD entry
    const eod = await EodEntry.findById(eodId);
    if (!eod) {
      return res.status(404).json({ message: "EOD entry not found" });
    }

    // Find the associated employee
    const employee = await User.findById(eod.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update feedback and status
    if (feedback) eod.feedback = feedback;
    if (status) eod.status = status;

    // Save the updated EOD entry
    const updatedEod = await eod.save();

    // Send notification to the employee
    const notificationMessage = `Your EOD titled "${eod.eodTitle}" has been updated to status "${status}" with feedback: "${feedback || "No feedback provided"}".`;
    await sendNotification(employee._id, notificationMessage, {
      eodId: eod._id,
      status,
    });

    res.status(200).json({
      message: "EOD feedback and status updated successfully",
      eod: updatedEod,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getEodsForCompany = async (req, res) => {
  try {
    const eods = await EodEntry.find({ companyId: req.params.companyId });
    res.json(eods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEodsForEmployee = async (req, res) => {
  try {
    const eods = await EodEntry.find({ employeeId: req.params.employeeId });
    res.json(eods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getEodsForUser = async (req, res) => {
  try {
    const eods = await EodEntry.find({ employeeId: req.user.id });
    res.json(eods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitEod, getEodsForCompany, getEodsForEmployee , updateEod , getEodsForUser
  ,updateEodFeedbackAndStatus
 };

const express = require("express");
const { getNotificationsForUser, markNotificationAsRead } = require("../controllers/notificationController");
const auth = require("../middlewares/auth");
const router = express.Router();

// Fetch notifications for a user
router.get("/", auth(["company", "employee"]), getNotificationsForUser);

// Mark a notification as read
router.patch("/read/:notificationId", auth(["company", "admin","employee"]), markNotificationAsRead);

module.exports = router;

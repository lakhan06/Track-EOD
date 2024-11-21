const express = require("express");
const { getNotificationsForUser, markNotificationAsRead } = require("../controllers/notificationController");
const auth = require("../middlewares/auth");
const router = express.Router();

// Fetch notifications for a user
router.get("/:userId", auth(["company", "admin"]), getNotificationsForUser);

// Mark a notification as read
router.patch("/read/:notificationId", auth(["company", "admin"]), markNotificationAsRead);

module.exports = router;

const Notification = require("../models/notificationModel")

// Fetch notifications for a user
const getNotificationsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getNotificationsForUser, markNotificationAsRead };

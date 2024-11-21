const Notification = require("../models/notificationModel");

const sendNotification = async (userId, message, metadata = {}) => {
  try {
    const notification = new Notification({
      userId,
      message,
      metadata,
    });
    await notification.save();
    console.log("Notification sent:", notification);
  } catch (err) {
    console.error("Error sending notification:", err.message);
  }
};

module.exports = { sendNotification };

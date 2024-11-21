const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The recipient of the notification
  message: { type: String, required: true }, // Customizable message
  metadata: { type: Object, default: {} }, // Additional dynamic data (e.g., related task ID, employee details)
  isRead: { type: Boolean, default: false }, // Whether the notification has been read
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", NotificationSchema);

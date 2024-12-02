import React, { useState, useEffect } from "react";
import { fetchNotifications, markNotificationRead } from "../../services/api"; // Import the API functions
import "./Notification.css";

const Notifications = () => {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNotifications();
        
        // Separate notifications into read and unread based on `isRead` field
        const unread = data.filter((notif) => !notif.isRead);
        const read = data.filter((notif) => notif.isRead);

        setUnreadNotifications(unread);
        setReadNotifications(read);
      } catch (err) {
        console.error("Error fetching notifications:", err.message);
        setError("Failed to fetch notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);

      // Move notification from unread to read
      setUnreadNotifications((prevUnread) =>
        prevUnread.filter((notif) => notif._id !== notificationId)
      );

      const readNotif = unreadNotifications.find(
        (notif) => notif._id === notificationId
      );
      if (readNotif) {
        setReadNotifications((prevRead) => [...prevRead, { ...readNotif, isRead: true }]);
      }
    } catch (err) {
      console.error("Error marking notification as read:", err.message);
      setError("Failed to mark notification as read. Please try again.");
    }
  };

  if (loading) return <div className="notifications-loading">Loading...</div>;
  if (error) return <div className="notifications-error">{error}</div>;

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>

      <div className="unread-notifications">
        <h3>Unread Notifications</h3>
        {unreadNotifications.length > 0 ? (
          <ul className="notifications-list">
            {unreadNotifications.map((notification) => (
              <li key={notification._id} className="notification-item unread">
                <p>{notification.message}</p>
                <span className="notification-date">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
                <button
                  className="mark-as-read-button"
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  Mark as Read
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No unread notifications.</p>
        )}
      </div>

      <div className="read-notifications">
        <h3>Read Notifications</h3>
        {readNotifications.length > 0 ? (
          <ul className="notifications-list">
            {readNotifications.map((notification) => (
              <li key={notification._id} className="notification-item read">
                <p>{notification.message}</p>
                <span className="notification-date">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No read notifications.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;

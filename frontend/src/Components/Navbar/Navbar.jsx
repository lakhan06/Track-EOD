import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import { fetchNotifications } from "../../services/api"; // Import the API function
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const getUnreadNotifications = async () => {
      try {
        const notifications = await fetchNotifications();
        const unreadNotifications = notifications.filter(
          (notification) => !notification.isRead
        );
        setUnreadCount(unreadNotifications.length);
      } catch (err) {
        console.error("Error fetching unread notifications:", err.message);
      }
    };

    if (user) {
      getUnreadNotifications();
    }
  }, [user]);

  return (
    <nav className="custom-navbar">
      <div className="navbar-content">
        <Link className="navbar-brand" to="/">
          Track EOD
        </Link>
        <div className="navbar-links">
          {user ? (
            <ul className="navbar-nav">
              {/* <li className="nav-item">
                <Link className="nav-link" to="/tasks">
                  Tasks
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link className="nav-link" to="/eod">
                  EOD
                </Link>
              </li> */}
              <li className="nav-item">
                <Link className="nav-link notificationbutton" to="/notifications">
                  Notifications{" "}
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <Link className="login-btn" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

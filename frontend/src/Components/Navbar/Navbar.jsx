import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import { fetchNotifications } from "../../services/api"; // Import the API function
import { GiHamburgerMenu } from "react-icons/gi"; // Import the hamburger icon
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-content">
        <Link className="navbar-brand" to="/?view=landing">
          Track EOD
        </Link>
        <button className="hamburger" onClick={toggleMenu}>
          <GiHamburgerMenu size={24} color="white" />
        </button>
        <div className={`navbar-links ${isMenuOpen ? "show" : ""}`}>
          {user ? (
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link notificationbutton"
                  to="/dashboard/notifications"
                >
                  Notifications{" "}
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li><Link to="/login">
              <button className="login-btn" onClick={logout}>
                Login
              </button>
              </Link></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

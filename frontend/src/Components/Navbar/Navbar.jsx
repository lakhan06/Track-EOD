import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="custom-navbar">
      <div className="navbar-content">
        <Link className="navbar-brand" to="/">
          Track EOD
        </Link>
        <div className="navbar-links">
          {user ? (
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/tasks">
                  Tasks
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/eod">
                  EOD
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/notifications">
                  Notifications
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

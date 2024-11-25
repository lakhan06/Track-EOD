import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./DashboardLayout.css";
// import { Link } from "react-router-dom";


const DashboardLayout = () => {
  // Mocked user data
  const user = {
    role: "employee", // Change to "employee" for testing
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
       <Link to={'/'}> <h3 className="sidebar-title">Dashboard</h3></Link>
        <ul className="sidebar-links">
          {user.role === "company" ? (
            <>
              <li>
                <Link to="/tasks">Manage Tasks</Link>
              </li>
              <li>
                <Link to="/">See Leaderboard</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/eod/add">Add EOD</Link>
              </li>
              <li>
                <Link to="/">See Leaderboard</Link>
              </li>
              <li>
                <Link to="/tasks">View Tasks</Link>
              </li>
            </>
          )}
          <li>
            <Link to="/profile">My Profile</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

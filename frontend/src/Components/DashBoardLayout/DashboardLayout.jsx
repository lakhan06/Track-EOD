import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { fetchUserData } from "../../services/api";
import { FaTasks, FaUsers, FaChartLine, FaPlusCircle } from "react-icons/fa"; // Import icons
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { user: fetchedUser } = await fetchUserData();
        setUser(fetchedUser);
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <ul className="sidebar-links">
          {user.role === "company" ? (
            <>
              <li>
                <Link to="tasks">
                  <FaTasks />
                  <span>Create Tasks</span>
                </Link>
              </li>
              <li>
                <Link to="employeeDetails">
                  <FaUsers />
                  <span>Employee Details</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard">
                  <FaChartLine />
                  <span>Leaderboard</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="createEod">
                  <FaPlusCircle />
                  <span>Add EOD</span>
                </Link>
              </li>
              <li>
                <Link to="employee/eods">
                  <FaTasks />
                  <span>View EODs</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard">
                  <FaChartLine />
                  <span>Leaderboard</span>
                </Link>
              </li>
              <li>
                <Link to="Employeetasks">
                  <FaTasks />
                  <span>View Tasks</span>
                </Link>
              </li>
            </>
          )}
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

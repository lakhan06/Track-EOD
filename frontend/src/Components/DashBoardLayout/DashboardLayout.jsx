import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { fetchUserData } from "../../services/api"; // Import the API function
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { user: fetchedUser } = await fetchUserData(); // Fetch user data
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
        <Link to={'/'}><h3 className="sidebar-title">Dashboard</h3></Link>
        <ul className="sidebar-links">
          {user.role === "company" ? (
            <>
              <li>
                <Link to="tasks">Create Tasks</Link>
              </li>
              <li>
                <Link to="employeeDetails">See Employee Deatils</Link>
              </li>
              <li>
                <Link to="/dashboard">See Leaderboard</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="createEod">Add EOD</Link>
              </li>
              <li>
                <Link to="employee/eods">See Your Eods</Link>
              </li>
              <li>
                <Link to="/dashboard">See Leaderboard</Link>
              </li>
              <li>
                <Link to="Employeetasks">View Tasks</Link>
              </li>
            </>
          )}
          {/* <li>
            <Link to="/profile">My Profile</Link>
          </li> */}
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

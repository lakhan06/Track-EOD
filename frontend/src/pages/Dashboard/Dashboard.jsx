import React, { useEffect, useState } from "react";
import { fetchUserData } from "../../services/api"; // Import the API function
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null); // Store user data
  const [stats, setStats] = useState({ totalEods: 0, streakCount: 0, longestStreak: 0 }); // Store stats
  const [leaderboard, setLeaderboard] = useState([]); // Store leaderboard data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetchUserData(); // Fetch user data
        setUser(response.user);

        // Mock stats and leaderboard (replace with real API calls if available)
        if (response.user.role === "employee") {
          setStats({
            totalEods: response.user.employeeDetails?.streakCount || 0,
            streakCount: response.user.employeeDetails?.streakCount || 0,
            longestStreak: response.user.employeeDetails?.longestStreak || 0,
          });
        }
        setLeaderboard([
          { username: "Lakhan Gupta", totalEods: 50 },
          { username: "Priya Sharma", totalEods: 45 },
          { username: "Ankit Verma", totalEods: 40 },
        ]);
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">

      {/* Main Content */}
      <main className="dashboard-main">
        <h2>Welcome, {user.username}</h2>

        <div className="dashboard-stats">
          {user.role === "employee" && (
            <>
              <div className="stat-card">
                <h3>Total EODs</h3>
                <p>{stats.totalEods}</p>
              </div>
              <div className="stat-card">
                <h3>Current Streak</h3>
                <p>{stats.streakCount} days</p>
              </div>
              <div className="stat-card">
                <h3>Longest Streak</h3>
                <p>{stats.longestStreak} days</p>
              </div>
            </>
          )}
          {user.role === "company" && (
            <div className="stat-card">
              <h3>Manage Your Team and Tasks</h3>
              <p>Use the "Manage Tasks" section to create and assign tasks.</p>
            </div>
          )}
        </div>

        {/* <h3 className="dashboard-leaderboard-title">Top Performers</h3>
        <ul className="leaderboard-list">
          {leaderboard.map((employee, index) => (
            <li key={index} className="leaderboard-item">
              <span>
                {index + 1}. {employee.username}
              </span>
              <span>{employee.totalEods} EODs</span>
            </li>
          ))}
        </ul> */}
      </main>
    </div>
  );
};

export default Dashboard;

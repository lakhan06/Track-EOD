import React, { useState, useEffect } from "react";
import { fetchEmployeesForCompany } from "../../services/api"; // Import the API functions
import { Link } from "react-router-dom";
import "./EmployeeDetails.css";

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]); // For filtered employees
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setError(null);
        setLoading(true);
        const { data } = await fetchEmployeesForCompany(); // API does not require companyId
        setEmployees(data.employees || []);
        setFilteredEmployees(data.employees || []); // Initialize filtered list
      } catch (err) {
        console.error("Error fetching employees:", err.message);
        setError("Failed to fetch employees. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getEmployees();
  }, []);

  // Update filteredEmployees whenever searchTerm changes
  useEffect(() => {
    const filtered = employees.filter((employee) =>
      employee.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  if (loading) return <div className="employees-loading">Loading...</div>;
  if (error) return <div className="employees-error">{error}</div>;

  return (
    <div className="employees-container">
      <h2 className="employees-title">Employee Details</h2>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by employee name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEmployees.length > 0 ? (
        <table className="employees-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Streak</th>
              <th>Longest Streak</th>
              <th>Last EOD Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.username || "N/A"}</td>
                <td>{employee.email || "N/A"}</td>
                <td>{employee.employeeDetails?.streakCount || 0}</td>
                <td>{employee.employeeDetails?.longestStreak || 0}</td>
                <td>
                  {employee.employeeDetails?.lastEodDate
                    ? new Date(employee.employeeDetails.lastEodDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  <Link to={`company/employeeEods/${employee._id}`}>
                    <button className="view-eods-button">View EODs</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="employees-empty">No employees found.</p>
      )}
    </div>
  );
};

export default EmployeeDetails;

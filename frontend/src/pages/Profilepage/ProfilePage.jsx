import React, { useState, useEffect } from "react";
import { fetchUserData, updateUserProfile } from "../../services/api"; // Import API functions
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetchUserData();
        setUser(response.user);
        setEditedData(response.user);
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  const handleSave = async () => {
    try {
      const updatedUser = await updateUserProfile(editedData);
      setUser(updatedUser); // Update user state with the response
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setError("Failed to update profile.");
    }
  };

  const renderEmployeeDetails = () => (
    <div className="profile-employee-details">
      <h3>Employee Details</h3>
      <div className="profile-row">
        <span>Company Name:</span>
        <span>
          {user.employeeDetails?.companyId?.companyDetails?.name || "Not Assigned"}
        </span>
      </div>
      <div className="profile-row">
        <span>Company Address:</span>
        <span>
          {user.employeeDetails?.companyId?.companyDetails?.address || "Not Available"}
        </span>
      </div>
      <div className="profile-row">
        <span>Company Username:</span>
        <span>{user.employeeDetails?.companyId?.username || "Not Available"}</span>
      </div>
      <div className="profile-row">
        <span>Current Streak:</span>
        <span>{user.employeeDetails?.streakCount || 0}</span>
      </div>
      <div className="profile-row">
        <span>Longest Streak:</span>
        <span>{user.employeeDetails?.longestStreak || 0}</span>
      </div>
      <div className="profile-row">
        <span>Last EOD Date:</span>
        <span>
          {user.employeeDetails?.lastEodDate
            ? new Date(user.employeeDetails.lastEodDate).toLocaleDateString()
            : "Not Available"}
        </span>
      </div>
    </div>
  );

  const renderCompanyDetails = () => (
    <div className="profile-company-details">
      <h3>Company Details</h3>
      <div className="profile-row">
        <span>Name:</span>
        {isEditing ? (
          <input
            type="text"
            value={editedData.companyDetails?.name || ""}
            onChange={(e) =>
              setEditedData({
                ...editedData,
                companyDetails: {
                  ...editedData.companyDetails,
                  name: e.target.value,
                },
              })
            }
          />
        ) : (
          <span>{user.companyDetails?.name || "Not Available"}</span>
        )}
      </div>
      <div className="profile-row">
        <span>Industry:</span>
        {isEditing ? (
          <input
            type="text"
            value={editedData.companyDetails?.industry || ""}
            onChange={(e) =>
              setEditedData({
                ...editedData,
                companyDetails: {
                  ...editedData.companyDetails,
                  industry: e.target.value,
                },
              })
            }
          />
        ) : (
          <span>{user.companyDetails?.industry || "Not Available"}</span>
        )}
      </div>
      <div className="profile-row">
        <span>Address:</span>
        {isEditing ? (
          <input
            type="text"
            value={editedData.companyDetails?.address || ""}
            onChange={(e) =>
              setEditedData({
                ...editedData,
                companyDetails: {
                  ...editedData.companyDetails,
                  address: e.target.value,
                },
              })
            }
          />
        ) : (
          <span>{user.companyDetails?.address || "Not Available"}</span>
        )}
      </div>
      <div className="profile-row">
        <span>Logo:</span>
        {user.companyDetails?.logo && (
          <img src={user.companyDetails.logo} alt="Company Logo" />
        )}
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="profile-header">
        <img
          src={
            user.companyDetails?.logo ||
            "https://via.placeholder.com/150" // Placeholder image
          }
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-header-info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="profile-content">
        {user.role === "company" && renderCompanyDetails()}
        {user.role === "employee" && renderEmployeeDetails()}
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="btn-save" onClick={handleSave}>
              Save
            </button>
            <button className="btn-cancel" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn-edit" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;

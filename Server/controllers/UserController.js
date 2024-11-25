const User = require("../models/userModel"); // Import your User schema

const fetchUserData = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming the user's ID is attached to `req.user` after authentication
  
      // Find user by ID
      const user = await User.findById(userId)
        .populate({
          path: "employeeDetails.companyId",
          select: "username companyDetails.name companyDetails.address",
        })
        .select("-password"); // Exclude password
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({ user }); // Return full user data including username
    } catch (err) {
      console.error("Error fetching user data:", err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  // Update profile API
const updateProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming user ID is available from authentication middleware
      const { username, email, companyDetails, employeeDetails } = req.body; // Destructure fields from request body
  
      // Find the user to update
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update common fields
      if (username) user.username = username;
      if (email) user.email = email;
  
      // Update specific fields based on role
      if (user.role === "company" && companyDetails) {
        user.companyDetails = {
          ...user.companyDetails,
          ...companyDetails, // Update only provided fields
        };
      } else if (user.role === "employee" && employeeDetails) {
        user.employeeDetails = {
          ...user.employeeDetails,
          ...employeeDetails, // Update only provided fields
        };
      }
  
      // Save the updated user
      const updatedUser = await user.save();
      res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      console.error("Error updating profile:", err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  
  module.exports = { fetchUserData , updateProfile };
  

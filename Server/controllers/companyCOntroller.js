const User = require("../models/userModel");

const getCompanies = async (req, res) => {
  try {
    // Fetch all companies with the role "company" and select only companyDetails
    const companies = await User.find({ role: "company" }).select("companyDetails");

    // Check if there are companies in the database
    if (!companies.length) {
      return res.status(404).json({
        success: false,
        message: "No companies found",
      });
    }

    // Send a success response with the companies data
    res.status(200).json({
      success: true,
      message: "Companies retrieved successfully",
      data: companies,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve companies",
      error: err.message,
    });
  }
};




const fetchEmployeesForCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // Fetch employees associated with the company
    const employees = await User.find({
      role: "employee",
      "employeeDetails.companyId": companyId,
    }).select("_id username email"); // Select specific fields

    if (!employees.length) {
      return res.status(404).json({ message: "No employees found for this company." });
    }

    res.status(200).json({ employees });
  } catch (err) {
    console.error("Error fetching employees:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {getCompanies, fetchEmployeesForCompany };


  
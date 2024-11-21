const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const { sendNotification } = require("../utils/notification");

const registerUserOrCompany = async (req, res) => {
  const { username, email, password, role, companyDetails, employeeDetails } = req.body;

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Prepare user data based on role
    const userData = {
      email,
      password,
      role,
      ...(role === "company" && { companyDetails }),
      ...(role === "employee" && { username, employeeDetails }),
    };

    // Create and save the user
    const newUser = new User(userData);
    await newUser.save();

    // Notify the company if an employee is joining
    if (role === "employee" && employeeDetails?.companyId) {
      const company = await User.findById(employeeDetails.companyId);
      if (company && company.role === "company") {
        // Send a generic notification
        await sendNotification(
          company.id,
          `${username} has joined your organization.`,
          { employeeId: newUser.id, employeeEmail: newUser.email }
        );
      }
    }

    // Generate a token
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return the response
    res.status(201).json({
      message: role === "company" ? "Company registered successfully" : "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        ...(role === "company" && { companyDetails: newUser.companyDetails }),
        ...(role === "employee" && { employeeDetails: newUser.employeeDetails }),
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { registerUserOrCompany };


const loginUserOrCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User or Company not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ...(user.role === "company" && { companyDetails: user.companyDetails }),
        ...(user.role === "employee" && { employeeDetails: user.employeeDetails }),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUserOrCompany, loginUserOrCompany };

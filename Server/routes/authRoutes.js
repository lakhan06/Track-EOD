const express = require("express");
const { registerUserOrCompany, loginUserOrCompany } = require("../controllers/authContoller");
const router = express.Router();

// Registration route for both users and companies
router.post("/register", registerUserOrCompany);

// Login route for both users and companies
router.post("/login", loginUserOrCompany);

module.exports = router;

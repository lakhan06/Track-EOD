const express = require("express");
const { getCompanies  , fetchEmployeesForCompany} = require("../controllers/companyCOntroller");

const router = express.Router();

// Route to get all companies
router.get("/", getCompanies);

// Route to fetch employees for a company
router.get("/employees/:companyId", fetchEmployeesForCompany);
module.exports = router;

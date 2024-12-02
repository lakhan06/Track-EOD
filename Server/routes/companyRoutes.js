const express = require("express");
const { getCompanies  , fetchEmployeesForCompany} = require("../controllers/companyCOntroller");

const router = express.Router();
const auth=require("../middlewares/auth")
// Route to get all companies
router.get("/", getCompanies);

// Route to fetch employees for a company
router.get("/employees",auth(["company"]), fetchEmployeesForCompany);
module.exports = router;

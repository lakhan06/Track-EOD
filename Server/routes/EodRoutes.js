const express = require("express");
const { submitEod, getEodsForCompany, getEodsForEmployee ,updateEod } = require("../controllers/EodController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/submit", auth(["employee"]), submitEod);
router.get("/company/:companyId", auth(["company", "admin"]), getEodsForCompany);
router.get("/employee/:employeeId", auth(["employee", "company", "admin"]), getEodsForEmployee);
router.patch("/:eodId", auth(["employee", "company", "admin"]), updateEod);

module.exports = router;

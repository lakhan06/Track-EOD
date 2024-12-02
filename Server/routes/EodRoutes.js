const express = require("express");
const { submitEod, getEodsForCompany, getEodsForEmployee ,updateEod , getEodsForUser,updateEodFeedbackAndStatus } = require("../controllers/EodController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/submit", auth(["employee"]), submitEod);
router.get("/company/:companyId", auth(["company", "admin"]), getEodsForCompany);
router.get("/employee/:employeeId", auth(["employee", "company", "admin"]), getEodsForEmployee);
router.get("/employee", auth(["employee"]), getEodsForUser);
router.patch("/:eodId", auth(["employee", "company", "admin"]), updateEod);
router.put("/:eodId", auth(["company"]), updateEodFeedbackAndStatus);

module.exports = router;

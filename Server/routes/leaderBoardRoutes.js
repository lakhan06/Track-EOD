const express = require("express");
const { getLeaderboardForCompany, updateLeaderboard } = require("../controllers/leaderBoardController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/company/:companyId", auth(["company", "admin"]), getLeaderboardForCompany);
router.post("/update", auth(["company", "admin"]), updateLeaderboard);

module.exports = router;

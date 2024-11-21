const express = require("express");
const { getRewardsForEmployee, addReward, redeemReward } = require("../controllers/rewardController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/employee/:employeeId", auth(["employee", "company", "admin"]), getRewardsForEmployee);
router.post("/add", auth(["company", "admin"]), addReward);
router.patch("/redeem/:rewardId", auth(["employee"]), redeemReward);

module.exports = router;

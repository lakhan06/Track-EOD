const Leaderboard = require("../models/leadedboardModel");

const getLeaderboardForCompany = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find({ companyId: req.params.companyId }).sort({ tokens: -1 });
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateLeaderboard = async (req, res) => {
  const { companyId, employeeId, tokens } = req.body;
  try {
    const leaderboardEntry = await Leaderboard.findOneAndUpdate(
      { companyId, employeeId },
      { $inc: { tokens } },
      { new: true, upsert: true }
    );
    res.json({ message: "Leaderboard updated successfully", leaderboardEntry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getLeaderboardForCompany, updateLeaderboard };

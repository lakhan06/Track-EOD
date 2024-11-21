const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tokens: { type: Number, default: 0 },
  rank: { type: Number },
  month: { type: String },
  year: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);

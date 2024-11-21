const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tokensEarned: { type: Number, default: 0 },
  redeemed: { type: Boolean, default: false },
  rewardType: { type: String }, // e.g., "Gift Card", "Cash"
  rewardDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reward", RewardSchema);

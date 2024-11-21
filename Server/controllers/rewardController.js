const Reward = require("../models//rewardModel");

const getRewardsForEmployee = async (req, res) => {
  try {
    const rewards = await Reward.find({ employeeId: req.params.employeeId });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addReward = async (req, res) => {
  const { employeeId, tokensEarned, rewardType } = req.body;
  try {
    const reward = new Reward({ employeeId, tokensEarned, rewardType });
    await reward.save();
    res.status(201).json({ message: "Reward added successfully", reward });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const redeemReward = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.rewardId);
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    reward.redeemed = true;
    await reward.save();
    res.json({ message: "Reward redeemed successfully", reward });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getRewardsForEmployee, addReward, redeemReward };

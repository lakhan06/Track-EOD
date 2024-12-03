const mongoose = require("mongoose");

const WorkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  deadline: { type: Date },
  status: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Work", WorkSchema);

const mongoose = require("mongoose");

const EodEntrySchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  workDescription: { type: String, required: true },
  mediaFiles: [{ type: String }],
  submissionDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Reviewed", "Approved"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EodEntry", EodEntrySchema);

const mongoose = require("mongoose");

const EodEntrySchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eodTitle: { type: String, required: true },
  workDescription: { type: String, required: true },
  mediaFiles: [{ type: String }],
  submissionDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Reviewed", "Approved","NotApproved"], default: "Pending" },
  feedback:{type: String},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EodEntry", EodEntrySchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "company", "employee"], required: true },
  companyDetails: {
    name: { type: String }, // Only for companies
    industry: { type: String }, // Only for companies
    logo: { type: String }, // Optional logo
    address:{type: String} 
  },
  employeeDetails: {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Links to the company
    streakCount: { type: Number, default: 0 }, // Only for employees
    longestStreak: { type: Number, default: 0 }, // Only for employees
    lastEodDate: { type: Date }, // Only for employees
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");


dotenv.config();
connectDB();

const app = express();
// Routes
const uploadRoutes = require("./routes/uploadRoutes");
// Serve static files from the uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));
app.use(express.json());
const cors = require("cors");


app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
  })
);

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/UserRoutes"));
app.use("/api/eod", require("./routes/EodRoutes"));
app.use("/api/reward", require("./routes/rewardRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
app.use("/api/notification", require("./routes/notificationRoutes"));
app.use("/api/leaderboard", require("./routes/leaderBoardRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));


//test Route


app.get("/" , (req , res)=>{
  return res.status(200).json({
    success:true,
    message:"You landed on the test route !"
  })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

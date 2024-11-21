const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/eod", require("./routes/EodRoutes"));
app.use("/api/reward", require("./routes/rewardRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
app.use("/api/notification", require("./routes/notificationRoutes"));
app.use("/api/leaderboard", require("./routes/leaderBoardRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

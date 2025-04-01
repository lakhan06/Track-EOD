const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

router.post("/", upload.single("file"), (req, res) => {
    console.log("Request Headers:", req.headers);
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);
  
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  
    // const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const fileUrl = `https://track-eod-backend.codewithabhinav.in/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
  });
  

module.exports = router;

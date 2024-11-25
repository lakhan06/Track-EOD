const express = require("express");
const {fetchUserData , updateProfile} = require("../controllers/UserController")

const router = express.Router();
const auth = require("../middlewares/auth");


// Route to fetch employees for a company
router.get("/",auth(["company", "employee" ,"admin"]), fetchUserData);
router.put("/profile", auth(["company", "employee" ,"admin"]), updateProfile);
module.exports = router;

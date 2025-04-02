const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { isUser} = require("../middleware/isUser");

// Auth Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", isUser, authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.put("/update-password", isUser, authController.updatePassword);

module.exports = router;
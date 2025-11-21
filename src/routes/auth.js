const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

// Signup
router.post("/signup", controller.signup);

// Login (email/password)
router.post("/login", controller.login);

// Google Login
router.post("/google-login", controller.googleLogin);

module.exports = router;

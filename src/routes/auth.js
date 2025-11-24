const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

// ONE API for signup, login, and google login
router.post("/", controller.authHandler);

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/dashboardController");

router.get("/users/:user_id/profile-progress", auth, controller.getProfileProgress);

module.exports = router;

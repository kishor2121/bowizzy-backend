const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/userController");

router.get("/users/:user_id", auth, controller.getUserById);

module.exports = router;

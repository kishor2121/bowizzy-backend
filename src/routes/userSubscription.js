const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/userSubscriptionController");

router.get("/users/:user_id/subscription", auth, controller.getSubscription);
router.post("/users/:user_id/subscription", auth, controller.createOrUpdateSubscription);

module.exports = router;

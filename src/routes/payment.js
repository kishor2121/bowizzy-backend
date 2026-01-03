const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/paymentController");

// Create Razorpay order (authenticated)
router.post("/create-order", auth, controller.createOrder);

// Verify payment after client checkout (authenticated)
router.post("/verify", auth, controller.verifyPayment);

module.exports = router;

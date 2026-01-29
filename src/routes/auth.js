const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

router.post("/", controller.authHandler);

router.post("/check-coupon", controller.checkCouponCode);

module.exports = router;

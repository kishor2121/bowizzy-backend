const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/userVerificationRequest");

router.post("/users/send-verification-request", auth, controller.sendVerificationRequest);
router.put("/admin/accept-verification-request", auth, controller.acceptVerificationRequest);

module.exports = router;

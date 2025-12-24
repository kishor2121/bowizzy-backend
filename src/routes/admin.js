const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/adminController");

// Get interviewer requests
router.get(
  "/admin/interviewers",
  auth,
  controller.getInterviewerRequests
);

// Verify interviewer
router.patch(
  "/admin/interviewers/:user_id/verify",
  auth,
  controller.verifyInterviewer
);

module.exports = router;

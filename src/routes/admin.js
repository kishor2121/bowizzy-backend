const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/adminController");

router.get(
  "/admin/interviewers",
  auth,
  controller.getInterviewerRequests
);

router.get(
  "/admin/approved-interviewers",
  auth,
  controller.approveInterviewer
);

router.get(
  "/admin/all-users",
  auth,
  controller.getAllUsers
);

router.patch(
  "/admin/interviewers/:user_id/verify",
  auth,
  controller.verifyInterviewer
);

router.put(
  "/admin/users/:user_id",
  controller.updateUser
);

router.get(
  "/admin/user-plan-stats",
  auth,
  controller.getUserPlanStats
);

router.get(
  "/admin/interview-slot-stats",
  auth,
  controller.getInterviewSlots
);

module.exports = router;
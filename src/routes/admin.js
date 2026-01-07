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

router.get("/revenue", auth, controller.getTotalRevenue);
router.get("/user-payments", auth, controller.getUserWiseRevenue);

//pricing_routes
router.post("/admin/pricing", auth, controller.createPrice);
router.get("/admin/pricing", auth, controller.getPrices);
router.put("/admin/pricing/:id", auth, controller.updatePrice);
router.delete("/admin/pricing/:id", auth, controller.deletePrice);

module.exports = router;
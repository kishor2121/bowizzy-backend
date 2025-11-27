const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const controller = require("../controllers/workExperienceController");

router.post(
  "/users/:user_id/work-experience",
  auth,
  controller.create
);

router.get(
  "/users/:user_id/work-experience",
  auth,
  controller.getByUser
);

router.get(
  "/users/:user_id/work-experience/:id",
  auth,
  controller.getById
);

router.put(
  "/users/:user_id/work-experience/job- role",
  auth,
  controller.updateJobRole
);

router.put(
  "/users/:user_id/work-experience/:id",
  auth,
  controller.update
);

router.delete(
  "/users/:user_id/work-experience/:id",
  auth,
  controller.remove
);

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const controller = require("../controllers/projectController");

router.post(
  "/users/:user_id/projects",
  auth,
  controller.create
);

router.get(
  "/users/:user_id/projects",
  auth,
  controller.getByUser
);

router.get(
  "/users/:user_id/projects/:id",
  auth,
  controller.getById
);

router.put(
  "/users/:user_id/projects/:id",
  auth,
  controller.update
);

router.delete(
  "/users/:user_id/projects/:id",
  auth,
  controller.remove
);

module.exports = router;

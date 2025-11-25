const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const upload = require("../utils/multer");
const controller = require("../controllers/personalDetailsController");

router.post(
  "/users/:user_id/personal-details",
  upload.single("photo"),
  auth,
  controller.create
);

router.get(
  "/users/:user_id/personal-details",
  auth,
  controller.getByUser
);

router.get(
  "/users/:user_id/personal-details/:id",
  auth,
  controller.getById
);

router.put(
  "/users/:user_id/personal-details/:id",
  upload.single("photo"),
  auth,
  controller.update
);

router.get("/personal-details", controller.getAll);

router.delete(
  "/users/:user_id/personal-details/:id",
  auth,
  controller.remove
);

module.exports = router;

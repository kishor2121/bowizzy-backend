const express = require("express");
const router = express.Router();

const upload = require("../utils/multer");
const controller = require("../controllers/personalDetailsController");

router.post(
  "/users/:user_id/personal-details",
  upload.single("photo"),
  controller.create
);

router.get(
  "/users/:user_id/personal-details/:id",
  controller.getById
);

router.put(
  "/users/:user_id/personal-details/:id",
  upload.single("photo"),
  controller.update
);

router.get("/personal-details", controller.getAll);

router.delete(
  "/users/:user_id/personal-details/:id",
  controller.remove
);

module.exports = router;

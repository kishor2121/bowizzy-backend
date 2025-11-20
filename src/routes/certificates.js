const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../utils/multer");
const controller = require("../controllers/certificateController");

router.post(
  "/users/:user_id/certificates",
  auth,
  upload.single("file"),
  controller.create
);

router.get(
  "/users/:user_id/certificates",
  auth,
  controller.getByUser
);

router.get(
  "/users/:user_id/certificates/:id",
  auth,
  controller.getById
);

router.put(
  "/users/:user_id/certificates/:id",
  auth,
  upload.single("file"),
  controller.update
);

router.delete(
  "/users/:user_id/certificates/:id",
  auth,
  controller.remove
);

module.exports = router;

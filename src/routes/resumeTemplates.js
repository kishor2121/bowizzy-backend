const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../utils/multer");
const controller = require("../controllers/resumeTemplateController");

const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "template_file", maxCount: 1 }
]);

router.post(
  "/users/:user_id/resume-templates",
  auth,
  uploadFields,
  controller.create
);

router.get(
  "/users/:user_id/resume-templates",
  auth,
  controller.getByUser
);

router.get(
  "/users/:user_id/resume-templates/:id",
  auth,
  controller.getById
);

router.put(
  "/users/:user_id/resume-templates/:id",
  auth,
  uploadFields,
  controller.update
);

router.delete(
  "/users/:user_id/resume-templates/:id",
  auth,
  controller.remove
);

module.exports = router;

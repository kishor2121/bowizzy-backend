const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/resumeController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/users/:user_id/resume/extract", auth, upload.single("file"), controller.extractResume);

module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/technicalSummaryController");
const auth = require("../middleware/auth");

router.post("/users/:userId/technical-summary", auth, controller.create);
router.get("/users/:userId/technical-summary", auth, controller.getByUser);
router.get("/users/:userId/technical-summary/:id", auth, controller.getById);
router.put("/users/:userId/technical-summary/:id", auth, controller.update);
router.delete("/users/:userId/technical-summary/:id", auth, controller.remove);

module.exports = router;

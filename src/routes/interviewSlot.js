const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/interviewSlotController");

router.post("/mock-interview/users/:user_id/interview-slot", auth, controller.create);
router.get("/mock-interview/interview-slot", auth, controller.getAll)
router.get("/users/:user_id/interview-slot", auth, controller.getByUser);
router.get("/users/:user_id/interview-slot/:id", auth, controller.getById);
router.put("/users/:user_id/interview-slot/:id", auth, controller.update);
router.delete("/users/:user_id/interview-slot/:id", auth, controller.remove);

module.exports = router;
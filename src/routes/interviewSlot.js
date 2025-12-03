const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/interviewSlotController");


router.post("/users/:user_id/mock-interview/interview-slot", auth, controller.create);
router.get("/users/mock-interview/interview-slot", auth, controller.getAll);
router.get("/users/:user_id/mock-interview/interview-slot", auth, controller.getByUser);
router.get("/users/:user_id/mock-interview/interview-slot/:id", auth, controller.getById);
router.put("/users/:user_id/mock-interview/interview-slot/:id", auth, controller.cancel);


module.exports = router;
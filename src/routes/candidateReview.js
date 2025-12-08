const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/candidateReviewController");


router.post("/users/:user_id/mock-interview/interviewer-review", auth, controller.create);
router.get("/users/:user_id/mock-interview/candidate-review", auth, controller.getByUser);
router.get("/users/:user_id/mock-interview/candidate-review/:id", auth, controller.getById);


module.exports = router;
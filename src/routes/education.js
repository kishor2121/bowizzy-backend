const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/educationController");


router.post("/users/:user_id/education", auth, controller.create);
router.get("/users/:user_id/education", auth, controller.getByUser);
router.get("/users/:user_id/education/:id", auth, controller.getById);
router.put("/users/:user_id/education/:id", auth, controller.update);
router.delete("/users/:user_id/education/:id", auth, controller.remove);

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/skillsController");

router.post("/users/:user_id/skills", auth, controller.create);
router.get("/users/:user_id/skills", auth, controller.getByUser);
router.get("/users/:user_id/skills/:skill_id", auth, controller.getById);
router.put("/users/:user_id/skills/:skill_id", auth, controller.update);
router.delete("/users/:user_id/skills/:skill_id", auth, controller.remove);

module.exports = router;

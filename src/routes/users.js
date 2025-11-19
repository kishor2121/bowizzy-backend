const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middleware/auth");

router.get("/", auth, usersController.getAllUsers);
router.get("/:id", auth, usersController.getUserById);
router.post("/", auth, usersController.createUser);
router.put("/:id", auth, usersController.updateUser);
router.delete("/:id", auth, usersController.deleteUser);

module.exports = router;

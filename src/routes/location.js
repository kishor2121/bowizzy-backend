const express = require("express");
const router = express.Router();
const controller = require("../controllers/locationController");

router.get("/locations", controller.getLocations);

module.exports = router;



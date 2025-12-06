const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/interviewScheduleController");

// API for getting user verification status
router.get("/users/:user_id/mock-interview/interview-schedule/user-verification", auth, controller.getUserVerificationStatus);


// Iinterview scheduling related APIs
router.post("/users/:user_id/mock-interview/interview-schedule", auth, controller.create);
router.get("/users/mock-interview/interview-schedule", auth, controller.getAll);
router.get("/users/:user_id/mock-interview/interview-schedule", auth, controller.getByUser);
router.get("/users/:user_id/mock-interview/interview-schedule/:id", auth, controller.getById);
router.put("/users/:user_id/mock-interview/interview-schedule/:id", auth, controller.cancel);


// Bank account info related APIs used while user verification
router.post("/users/:user_id/verification/bank-details", auth, controller.createBankAccountInfo);
router.get("/users/:user_id/verification/bank-details/:bank_id", auth, controller.getBankAccountDetails);
router.put("/users/:user_id/verification/bank-details/:bank_id", auth, controller.updateBankAccountDetails);
router.delete("/users/:user_id/verification/bank-details/:bank_id", auth, controller.deleteBankAccountDetails);



module.exports = router;

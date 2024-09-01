const express = require("express");
const router = express.Router();
const requestsController = require("../controllers/requestsController");
const { verifyToken } = require("../middlewares/verifyToken");


router.get("/api/referral-requests", verifyToken, requestsController.getAllRequests);
router.get("/api/referral-requests/:id", verifyToken, requestsController.getRequestById);

module.exports = router;

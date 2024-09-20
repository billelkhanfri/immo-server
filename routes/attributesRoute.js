const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyToken");
const attributeReferral = require("../controllers/attributesController");

router.get(
  "/api/referrals-attributes",
  verifyToken,
  attributeReferral.getAllAttributes
);

module.exports = router;

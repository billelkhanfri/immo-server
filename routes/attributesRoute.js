const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyToken");
const attributeReferral = require("../controllers/attributesController");

router.get(
  "/api/referrals-attributes",
  verifyToken,
  attributeReferral.getAllAttributes
);
router.get("/api/referrals-attributes/:id", verifyToken, attributeReferral.getAttributeById);
router.put('/api/referrals-attributes/:id',verifyToken, attributeReferral.updateReferralAttributeStatus);


module.exports = router;

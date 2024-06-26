const express = require("express");
const router = express.Router();
const {
  createReferral,
  requestReferral,
  updateReferralRequestStatus,
  updateReferralStatus,
} = require("../controllers/referralController");
const { verifyToken } = require("../middlewares/verifyToken");


//Créer un referral
router.post("/api/referrals", verifyToken, createReferral);

// Demander un referral
router.post("/api/referrals/:id/request", verifyToken, requestReferral);

// Mettre à jour le statut d'une demande de referral
router.patch(
  "/api/referrals/requests/:id",
 verifyToken,
  updateReferralRequestStatus
);

// Mettre à jour le statut d'un referral
router.patch("/api/referrals/:id/status", verifyToken, updateReferralStatus);

module.exports = router;
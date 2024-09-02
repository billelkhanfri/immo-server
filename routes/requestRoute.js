const express = require("express");
const router = express.Router();
const requestsController = require("../controllers/requestsController");
const { verifyToken } = require("../middlewares/verifyToken");

router.get(
  "/api/referral-requests",
  verifyToken,
  requestsController.getAllRequests
);
router.get(
  "/api/referral-requests/:id",
  verifyToken,
  requestsController.getRequestById
);
/**
 * @swagger
 * /api/referrals/requests/{id}:
 *   patch:
 *     summary: Mettre à jour le statut d'une demande de referral
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la demande de referral
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "accepted"
 *     responses:
 *       200:
 *         description: Statut de la demande de referral mis à jour
 *       404:
 *         description: Demande de referral non trouvée ou déjà traitée
 *       500:
 *         description: Erreur serveur
 */
router.patch(
  "/api/referral-requests/status/:id",
  verifyToken,
  requestsController.updateReferralRequestStatus
);

module.exports = router;

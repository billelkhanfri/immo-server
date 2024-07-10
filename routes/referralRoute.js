const express = require("express");
const router = express.Router();
const referralController = require("../controllers/referralController");
const { verifyToken } = require("../middlewares/verifyToken");

/**
 * @swagger
 * /api/referrals:
 *   post:
 *     summary: Créer un nouveau referral
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeDeReferral:
 *                 type: string
 *                 description: Type de referral
 *                 example: "type1"
 *               natureDuContact:
 *                 type: string
 *                 description: Nature du contact
 *                 example: "contact direct"
 *               commentaire:
 *                 type: string
 *                 description: Commentaire sur le referral
 *                 example: "Ceci est un commentaire"
 *               honnoraire:
 *                 type: number
 *                 description: Honnoraire du referral
 *                 example: 100
 *               price:
 *                 type: number
 *                 description: Prix du referral
 *                 example: 200
 *               receiverId:
 *                 type: string
 *                 description: ID du receiver, peut être null
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Referral créé avec succès
 *       400:
 *         description: Erreurs de validation
 *       500:
 *         description: Erreur serveur
 */
router.post("/api/referrals", verifyToken, referralController.createReferral);

/**
 * @swagger
 * /api/referrals:
 *   get:
 *     summary: Récupérer tous les referrals
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des referrals
 *       500:
 *         description: Erreur serveur
 */
router.get("/api/referrals", verifyToken, referralController.getAllReferrals);

/**
 * @swagger
 * /api/referrals/:id:
 *   get:
 *     summary: Récupérer un referral par ID
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du referral
 *     responses:
 *       200:
 *         description: Referral trouvé
 *       404:
 *         description: Referral non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/api/referrals/:id",
  verifyToken,
  referralController.getReferralById
);

/**
 * @swagger
 * /api/referrals/:id:
 *   put:
 *     summary: Mettre à jour un referral
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du referral
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeDeReferral:
 *                 type: string
 *               natureDuContact:
 *                 type: string
 *               commentaire:
 *                 type: string
 *               honnoraire:
 *                 type: number
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Referral mis à jour
 *       400:
 *         description: Erreurs de validation
 *       404:
 *         description: Referral non trouvé
 *       500:
 *         description: Erreur serveur
 */
// router.put(
//   "/api/referrals/:id",
//   verifyToken,
//   referralController.updateReferral
// );

/**
 * @swagger
 * /api/referrals/:id:
 *   delete:
 *     summary: Supprimer un referral
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du referral
 *     responses:
 *       200:
 *         description: Referral supprimé avec succès
 *       404:
 *         description: Referral non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete(
  "/api/referrals/:id",
  verifyToken,
  referralController.deleteReferral
);

/**
 * @swagger
 * /api/referrals/{id}/request:
 *   post:
 *     summary: Demander un referral
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du referral
 *     responses:
 *       201:
 *         description: Demande de referral envoyée avec succès
 *       404:
 *         description: Referral non trouvé ou déjà attribué
 *       500:
 *         description: Erreur serveur
 */
router.post(
  "/api/referrals/:id/request",
  verifyToken,
  referralController.requestReferral
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
  "/api/referrals/requests/:id",
  verifyToken,
  referralController.updateReferralRequestStatus
);

/**
 * @swagger
 * /api/referrals/:id/status:
 *   patch:
 *     summary: Mettre à jour le statut d'un referral
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du referral
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "attribue"
 *     responses:
 *       200:
 *         description: Statut du referral mis à jour
 *       404:
 *         description: Referral non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch(
  "/api/referrals/:id/status",
  verifyToken,
  referralController.updateReferralStatus
);
/**
 * @swagger
 * /api/myreferrals:
 *   get:
 *     summary: Récupérer les referrals de l'utilisateur actuel
 *     description: Récupère tous les referrals envoyés et reçus par l'utilisateur authentifié.
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Une liste des referrals envoyés et reçus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sentReferrals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Referral'
 *                 receivedReferrals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Referral'
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/api/myreferrals",
  verifyToken,
  referralController.getMyReferrals
);


module.exports = router;

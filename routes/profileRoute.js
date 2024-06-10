/**
 * @swagger
 * /api/profiles/{userId}:
 *   put:
 *     tags:
 *       - Profil
 *     summary: Met à jour un profil d'utilisateur
 *     description: Met à jour les informations du profil d'un utilisateur
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID de l'utilisateur dont le profil doit être mis à jour
 *       - name: body
 *         in: body
 *         required: true
 *         description: Les nouvelles données du profil
 *         schema:
 *           type: object
 *           properties:
 *             organisation:
 *               type: string
 *               example: "Nouvelle Organisation"
 *             competence:
 *               type: string
 *               example: "Nouvelle Compétence"
 *             secteur:
 *               type: string
 *               example: "Nouveau Secteur"
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: string
 *               example: "Profil mis à jour avec succès"
 *             profil:
 *               type: object
 *               properties:
 *                 organisation:
 *                   type: string
 *                 competence:
 *                   type: string
 *                 secteur:
 *                   type: string
 *       400:
 *         description: Erreur de validation ou de requête
 *         schema:
 *           type: object
 *           properties:
 *             errors:
 *               type: array
 *               items:
 *                 type: string
 *       403:
 *         description: Utilisateur non autorisé
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Vous n'êtes pas autorisé à mettre à jour ce profil"
 *       404:
 *         description: Utilisateur non trouvé
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur serveur
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Erreur serveur"
 */

// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

router.put("/api/profiles/:userId", profileController.updateProfile);

module.exports = router;

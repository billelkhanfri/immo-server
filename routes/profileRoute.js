const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { verifyToken } = require("../middlewares/verifyToken");
const photoUpload = require("../middlewares/multer-config");
/**
 * @swagger
 * /api/profiles/{userId}:
 *   put:
 *     summary: Mettre à jour le profil de l'utilisateur
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organisation:
 *                 type: string
 *                 example: "Organisation Name"
 *               competence:
 *                 type: string
 *                 example: "Competence"
 *               secteur:
 *                 type: string
 *                 example: "Secteur"
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "Profil mis à jour avec succès"
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     organisation:
 *                       type: string
 *                     competence:
 *                       type: string
 *                     secteur:
 *                       type: string
 *                     userId:
 *                       type: integer
 *       400:
 *         description: Mauvaise requête
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Profil non trouvé
 *       500:
 *         description: Erreur serveur
 */

// routes/profileRoutes.js

router.put(
  "/api/profiles/:userId",
  verifyToken,
  profileController.updateProfile
);

router.post(
  "/api/profiles/profile-photo-upload",
  photoUpload.single("image"),
  profileController.uploadPhoto
);
module.exports = router;

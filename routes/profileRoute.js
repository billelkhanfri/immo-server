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
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               competence:
 *                 type: string
 *                 example: "Competence"
 *               about:
 *                 type: string
 *                 example: " à propos ......."
 *
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
 *                       type: string
 *                     competence:
 *                       type: string
 *                     about:
 *                       type: string
 *                     userId:
 *                       type: string
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
/**
 * @swagger
 * /api/profiles/profile-photo-upload:
 *   post:
 *     summary: Téléverser une photo de profil
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: L'image à téléverser
 *     responses:
 *       200:
 *         description: Image téléversée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image téléversée avec succès"
 *                 imageUrl:
 *                   type: string
 *                   example: "https://cloudinary.com/path/to/image.jpg"
 *       400:
 *         description: Pas de photo envoyée
 *       500:
 *         description: Erreur lors du téléversement de l'image
 */

router.post(
  "/api/profiles/profile-photo-upload",
  verifyToken,

  photoUpload.single("image"),

  profileController.uploadPhoto
);
module.exports = router;

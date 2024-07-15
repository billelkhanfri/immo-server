const express = require("express");
const router = express.Router();
const ratingsController = require("../controllers/ratingsController");
const { verifyToken } = require("../middlewares/verifyToken");

/**
 * @swagger
 * /api/users/{userId}/ratings:
 *   post:
 *     summary: Créer une nouvelle évaluation
 *     description: Crée une nouvelle évaluation pour le profil de l'utilisateur spécifié.
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur à évaluer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ratingValue:
 *                 type: integer
 *                 description: La valeur de l'évaluation
 *                 example: 5
 *     responses:
 *       201:
 *         description: Évaluation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: Évaluation créée avec succès
 *                 rating:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     ratingValue:
 *                       type: integer
 *                     profileId:
 *                       type: integer
 *                     evaluatorId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       400:
 *         description: Le vote doit être entre 1 et 5
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la création de l'évaluation
 */
router.post(
  "/api/users/:userId/ratings",
  verifyToken,
  ratingsController.createRating
);

/**
 * @swagger
 * /api/users/{userId}/ratings:
 *   get:
 *     summary: Récupérer toutes les évaluations d'un utilisateur
 *     description: Récupère toutes les évaluations pour le profil de l'utilisateur spécifié.
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Évaluations récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: Évaluations récupérées avec succès
 *                 ratings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       ratingValue:
 *                         type: integer
 *                       profileId:
 *                         type: integer
 *                       evaluatorId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *                       evaluator:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la récupération des évaluations
 */
router.get(
  "/api/users/:userId/ratings",
  verifyToken,
  ratingsController.getRatings
);

/**
 * @swagger
 * /api/ratings/{ratingId}:
 *   put:
 *     summary: Mettre à jour une évaluation
 *     description: Met à jour une évaluation existante.
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: ratingId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'évaluation à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ratingValue:
 *                 type: integer
 *                 description: La nouvelle valeur de l'évaluation
 *                 example: 4
 *     responses:
 *       200:
 *         description: Évaluation mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: Évaluation mise à jour avec succès
 *                 rating:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     ratingValue:
 *                       type: integer
 *                     profileId:
 *                       type: integer
 *                     evaluatorId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       403:
 *         description: Vous n'êtes pas autorisé à mettre à jour cette évaluation
 *       404:
 *         description: Évaluation non trouvée
 *       500:
 *         description: Erreur lors de la mise à jour de l'évaluation
 */
router.put(
  "/api/ratings/:ratingId",
  verifyToken,
  ratingsController.updateRating
);

/**
 * @swagger
 * /api/ratings/{ratingId}:
 *   delete:
 *     summary: Supprimer une évaluation
 *     description: Supprime une évaluation existante.
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: ratingId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'évaluation à supprimer
 *     responses:
 *       200:
 *         description: Évaluation supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: Évaluation supprimée avec succès
 *       403:
 *         description: Vous n'êtes pas autorisé à supprimer cette évaluation
 *       404:
 *         description: Évaluation non trouvée
 *       500:
 *         description: Erreur lors de la suppression de l'évaluation
 */
router.delete(
  "/api/ratings/:ratingId",
  verifyToken,
  ratingsController.deleteRating
);
module.exports = router;

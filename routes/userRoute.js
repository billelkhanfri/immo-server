const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/verifyToken");

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupère tous les utilisateurs avec leurs profils
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs avec leurs profils
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   organisation:
 *                     type: string
 *                   email:
 *                     type: string
 *                   telephone:
 *                     type: string
 *                   secteur:
 *                     type: string
 *                   cpi:
 *                     type: string
 *                   termsAccepted:
 *                     type: boolean
 *                   isEmailVerified:
 *                     type: boolean
 *                   profil:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       image:
 *                         type: string
 *                       competence:
 *                         type: string
 *                    
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Message d'erreur détaillé"
 */


router.get("/api/users", verifyToken, userController.getAlluser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 organistaion:
 *                   type: string
 *                 email:
 *                   type: string
 *                 telephone:
 *                   type: string
 *                 secteur:
 *                   type: string
 *                 cpi:
 *                   type: string
 *                 termsAccepted:
 *                   type: boolean
 *                 isEmailVerified:
 *                   type: boolean
 *                 profil:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     image:
 *                       type: string
 *                     competence:
 *                       type: string
 *                   
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Message d'erreur détaillé"
 */

router.get("/api/users/:id",  userController.getUserById);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lastName
 *               - firstName
 *               - organisation
 *               - email
 *               - password
 *               - secteur
 *               - cpi
 *               - termsAccepted
 *             properties:
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               organisation:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               password:
 *                 type: string
 *               secteur:
 *                 type: string
 *               cpi:
 *                 type: string
 *               termsAccepted:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 lastName:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 telephone:
 *                   type: string
 *                 token:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Entrée invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                 error:
 *                   type: string
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/api/register", authController.createUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Connecte un utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 lastName:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Email ou mot de passe invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/api/login", authController.loginUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               password:
 *                 type: string
 *               cpi:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     lastName:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     cpi:
 *                       type: string
 *                     termsAccepted:
 *                       type: boolean
 *       400:
 *         description: Entrée invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       403:
 *         description: Vous n'êtes pas autorisé à mettre à jour cet utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put("/api/users/:id", verifyToken, userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete("/api/users/:id", verifyToken, userController.deleteUser);

// Route pour vérifier l'email

/**
 * @swagger
 * /api/verify-email/{token}:
 *   get:
 *     summary: Vérifie l'email de l'utilisateur à l'aide du jeton de vérification.
 *     description: Cette route permet de vérifier l'email de l'utilisateur en utilisant un jeton de vérification envoyé par e-mail lors de l'inscription.
 *     tags: [Confirmation]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Jeton de vérification envoyé par e-mail.
 *     responses:
 *       200:
 *         description: Email vérifié avec succès.
 *       400:
 *         description: Jeton de vérification invalide ou expiré.
 *       404:
 *         description: Jeton de vérification introuvable.
 *       500:
 *         description: Erreur serveur.
 */



/**
 * @swagger
 * /api/count:
 *   get:
 *     summary: Count the users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The number of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 100
 *       403:
 *         description: User is not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vous n'êtes pas autorisé"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
router.get("/api/count", verifyToken, userController.countUser)




router.get("/api/verify-email/:token", authController.verifyEmail);
module.exports = router;
 
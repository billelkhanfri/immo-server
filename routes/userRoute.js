const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/verifyToken");


// Route pour créer un nouvel utilisateur
router.post("/api/register", authController.createUser);
// Route pour le login du utilisateur
router.post("/api/login", authController.loginUser);
// Route pour la mise à jour utilisateur
router.put("/api/users/:id",verifyToken, userController.updateUser);
// Route pour supprimer un utilisateur
router.delete("/api/users/:id", userController.deleteUser);

module.exports = router;

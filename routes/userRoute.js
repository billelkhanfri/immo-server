const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// Route pour créer un nouvel utilisateur
router.post("/api/register", authController.createUser);
router.post("/api/login", authController.loginUser);
router.put("/api/users/:id", userController.updateUser);

module.exports = router;

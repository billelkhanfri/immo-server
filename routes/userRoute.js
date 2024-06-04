const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Route pour créer un nouvel utilisateur
router.post("/api/register", authController.createUser);
router.post("/api/login", authController.loginUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route pour créer un nouvel utilisateur
router.post("/api/register", userController.createUser);
router.post("/api/login", userController.loginUser);

module.exports = router;

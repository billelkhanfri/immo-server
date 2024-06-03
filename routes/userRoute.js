const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route pour créer un nouvel utilisateur
router.post("/login", userController.createUser);

module.exports = router;

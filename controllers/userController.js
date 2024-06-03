const db = require("../models");
const bcrypt = require("bcrypt");
const { registerSchema } = require("../validation/userValidation");

/**
 * @desc Créé un utilisateur
 * @route POST /api/user
 * @method POST
 * @access Private
 */
const createUser = async (req, res) => {
  // Validation du request body avec the Joi schema
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((detail) => detail.message) });
  }

  try {
    const { username, email, password, cpi } = req.body;

    // Valider les données d'entrée
    if (!username || !email || !password || !cpi) {
      return res
        .status(400)
        .json({ error: "Tous les champs sont obligatoires." });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Un utilisateur avec cet email existe déjà." });
    }
    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = await db.User.create({
      username,
      email,
      password: hashedPassword,
      cpi,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createUser,
};

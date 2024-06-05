const db = require("../models");
const bcrypt = require("bcrypt");
const { registerSchema, loginSchema } = require("../validation/userValidation");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/**
 * @desc Créé un utilisateur
 * @route POST /api/register
 * @method POST
 * @access Public
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
    const { username, email, password, cpi, termsAccepted } = req.body;

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
      termsAccepted,
    });

    // Generer un token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "4h" }
    );
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res
      .status(201)
      .json({
        ...userWithoutPassword,
        token,
        message: "Utilisateur créé avec succès",
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Login utilisateur
 * @route POST /api/login
 * @method POST
 * @access Public
 */

const loginUser = async (req, res) => {
  // Validation du request body avec the Joi schema
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((detail) => detail.message) });
  }
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.User.findOne({ where: { email } });
    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "Email ou mot de passe invalides." });
    }

    // Vérifier le mot de passe
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ error: "Email ou mot de passe invalides." });
    }

    // Generer un token
    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "4h" }
    );
    const { password: _, ...userWithoutPassword } = existingUser.toJSON();

    res.status(200).json({ ...userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
};

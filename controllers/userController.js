const db = require("../models");
const bcrypt = require("bcrypt");
const { registerSchema, loginSchema } = require("../validation/userValidation");

/**
 * @desc Créé un utilisateur
 * @route POST /api/register
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

/**
 * @desc Login utilisateur
 * @route POST /api/login
 * @method POST
 * @access Pblic
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

    // // Générer un token JWT
    // const token = jwt.sign(
    //   { id: existingUser.id, email: existingUser.email },
    //   config.jwtSecret,
    //   { expiresIn: "1h" }
    // );

    // Retourner l'utilisateur et le token
    res.status(200).json({ user: existingUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
};

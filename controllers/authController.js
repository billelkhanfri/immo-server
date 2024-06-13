const db = require("../models");
const bcrypt = require("bcrypt");
const { registerSchema, loginSchema } = require("../validation/userValidation");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");
const { sendEmail } = require("../helpers/email");
const { createDefaultProfileImage } = require("../helpers/generateImage");
const { Op } = require("sequelize");


/**
 * @desc Créé un utilisateur
 * @route POST /api/register
 * @method POST
 * @access Public
 */
const createUser = async (req, res) => {
  // Validation du request body avec le schéma Joi
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((detail) => detail.message) });
  }

  try {
    const { firstName, lastName, email, password, cpi, termsAccepted } =
      req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.User.findOne({ where: { email } });
    const existingUserCpi = await db.User.findOne({ where: { cpi } });

    if (existingUser) {
      return res
        .status(400)
        .json({ errorEmail: "Un utilisateur avec cet email existe déjà." });
    }
    if (existingUserCpi) {
      return res
        .status(400)
        .json({ errorCpi: "Un utilisateur avec ce cpi existe déjà." });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Créer un nouvel utilisateur
    const user = await db.User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      cpi,
      termsAccepted,
      emailVerificationToken,
    });
    const initials = `${firstName[0]}${lastName[0]}`;
    const imagePath = await createDefaultProfileImage(initials);

    //Créer un profil vierge pour l'utilisateur
    await db.Profile.create({
      userId: user.id,
      organisation: "",
      image: imagePath,
      competence: "",
      secteur: "",
    });

    // Créer le lien de vérification d'email
    const verificationUrl = `http://localhost:2000/api/verify-email/${emailVerificationToken}`;
    await sendEmail(
      email,
      "Email de vérification",
      `Nous vous adressons le lien pour vous connectez à Immo :: ${verificationUrl}`
    );

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "4h" }
    );
    const {
      password: dummy,
      emailVerificationToken: _,
      ...userWithoutPassword
    } = user.toJSON();

    res.status(201).json({
      ...userWithoutPassword,
      token,
      message:
        "Utilisateur créé avec succès. Un email de vérification a été envoyé.",
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


  const { emailOrCpi, password } = req.body;

    try {
    // Vérifier si l'utilisateur existe par email ou par cpi
    const existingUser = await db.User.findOne({
      where: {
        [Op.or]: [{ email: emailOrCpi }, { cpi: emailOrCpi }]
      }
    });
         if (!existingUser) {
      return res.status(400).json({ error: 'Email/cpi ou mot de passe invalides.' });
    }

    // Vérifier le mot de passe
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ error: 'Email/cpi ou mot de passe invalides.'  });
    }

   // Générer un token JWT
    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: '4h' }
    );

    const { password: dummy, ...userWithoutPassword } = existingUser.toJSON();

    res.status(200).json({
      ...userWithoutPassword,
      token,
      message: 'Connexion réussie.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Vérifie l'email de l'utilisateur
 * @route GET /api/verify-email/:token
 * @method GET
 * @access Public
 */
const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await db.User.findOne({
      where: { emailVerificationToken: token },
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Token de vérification invalide ou expiré." });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email vérifié avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  verifyEmail,
};

const db = require("../models");
const bcrypt = require("bcrypt");
const { registerSchema, loginSchema } = require("../validation/userValidation");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");
const { sendEmail } = require("../helpers/email");
const { Op } = require("sequelize");

/**
 * @desc Créer un utilisateur
 * @route POST /api/register
 * @method POST
 * @access Public
 */
const createUser = async (req, res) => {
  // // Validation du corps de la requête avec le schéma Joi
  // const { error } = registerSchema.validate(req.body, { abortEarly: false });
  // if (error) {
  //   return res.status(400).json({ message: error.details.map((detail) => detail.message) });
  // }

  try {
    const {
      firstName,
      lastName,
      organisation,
      telephone,
      email,
      password,
      secteur,
      cpi,
      termsAccepted,
      address, // Expecting address object
    } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.User.findOne({
      where: { [Op.or]: [{ email }, { cpi }] },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Les informations fournies sont déjà utilisées." });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Créer un nouvel utilisateur
    const user = await db.User.create({
      firstName,
      lastName,
      organisation,
      telephone,
      email,
      password: hashedPassword,
      cpi,
      secteur,
      termsAccepted,
      emailVerificationToken,
    });

    // Créer un profil vierge pour l'utilisateur
    await db.Profile.create({
      userId: user.id,
      imageUrl: "",
      publicId: "",
      competence: "",
      about: "",
    });

    // Vérifier et créer l'adresse si fournie
    if (address) {
      const { street, city, region, postalCode, country } = address; // Destructure the address object

      // Create the address
      await db.Address.create({
        userId: user.id, // Associating address with the new user
        street,
        city,
        region,
        postalCode,
        country,
      });
    }

    // Créer le lien de vérification d'email
    const verificationUrl = `http://localhost:5173/inscription/${user.id}/verify-email/${emailVerificationToken}`;
    await sendEmail(
      email,
      "Email de vérification",
      `Nous vous adressons le lien pour vous connecter à Immo :: ${verificationUrl}`
    );

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY
    );

    res.status(201).json({
      message:
        "Utilisateur créé avec succès. Un email de vérification a été envoyé.",
      token, // Optionally return the token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Connexion utilisateur
 * @route POST /api/login
 * @method POST
 * @access Public
 */
const loginUser = async (req, res) => {
  // Validation du corps de la requête avec le schéma Joi
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
        [Op.or]: [{ email: emailOrCpi }, { cpi: emailOrCpi }],
      },
      include: {
        model: db.Profile,
        as: "Profile",
      },
    });

    // Assurez-vous que `existingUser` est défini
    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "Email/cpi ou mot de passe invalides." });
    }

    // Vérifier le mot de passe
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ error: "Email/cpi ou mot de passe invalides." });
    }

     //Vérifiez si l'email a été vérifié
     if (!existingUser.isEmailVerified) {
       return res.status(400).json({
        message: "Un email de vérification a été envoyé, veuillez le vérifier.",
      });
     }

    // Générer un token JWT
    const token = jwt.sign(
      { id: existingUser.id, isAdmin: existingUser.isAdmin },
      process.env.SECRET_KEY
    );

    res.status(200).json({
      id: existingUser.id,
      isAdmin: existingUser.isAdmin,
      firstName: existingUser.firstName,
      profilePhoto: existingUser.Profile.imageUrl,
      token,
      message: "Connexion réussie.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Vérification de l'email de l'utilisateur
 * @route GET /api/:userId/verify-email/:token
 * @method GET
 * @access Public
 */
const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;
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

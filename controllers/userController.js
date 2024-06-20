const db = require("../models");
const bcrypt = require("bcryptjs");
const { updateUserSchema } = require("../validation/userValidation");
const { cloudinaryRemoveImage } = require("../helpers/couldinary");

/**
 * @desc Affiche tous les utilisateur
 * @route GET /api/users
 * @access Private (only admin)
 */

const getAlluser = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      message: "Accès refusé. Vous n'êtes pas autorisé",
    });
  }
  try {
    const users = await db.User.findAll({
      include: { model: db.Profile, as: "Profile" },

      attributes: {
        exclude: ["password"],
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur serveur:", error);
    // Envoyer une réponse avec un message d'erreur
    res.status(500).json({ error: "Erreur serveur" });
  }
};
/**
 * @desc Affiche utilisateur par son id
 * @route GET /api/users:id
 * @access public
 */

const getUserById = async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.params.id },
      include: {
        model: db.Profile,
        as: "Profile",
      },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Met à jour un utilisateur
 * @route PUT /api/users/:id
 * @access Private(only user himself)
 */

const updateUser = async (req, res) => {
  // Validation du request body avec le schema Joi
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((detail) => detail.message) });
  }

  const { id } = req.params;

  // Vérification que l'utilisateur connecté est bien celui qui fait la demande
  if (req.user.id !== id) {
    return res.status(403).json({
      error: "Vous n'êtes pas autorisé à mettre à jour cet utilisateur",
    });
  }

  try {
    // Rechercher l'utilisateur à mettre à jour dans la base de données
    const foundUser = await db.User.findByPk(id);

    // Si l'utilisateur n'existe pas, renvoyer une erreur 404
    if (!foundUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Si le mot de passe est fourni dans la requête, le hasher avant de l'enregistrer
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Exclure le champ email du corps de la requête
    delete req.body.email;

    // Mise à jour de l'utilisateur avec les nouvelles données
    await foundUser.update(req.body);

    // Exclure le mot de passe des données de l'utilisateur avant de renvoyer la réponse
    const { password, ...userWithoutPassword } = foundUser.toJSON();

    // Envoyer une réponse avec un message de succès et les données de l'utilisateur mis à jour
    res.status(200).json({
      success: "Utilisateur mis à jour avec succès",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    // Envoyer une réponse avec un message d'erreur
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
  }
};

/**
 * @desc Supprime un utilisateur
 * @route DELETE /api/users/:id
 * @access Private
 */

const deleteUser = async (req, res) => {
  const { id } = req.params;
  // Vérification que l'utilisateur connecté est bien celui qui fait la demande
  if (req.user.id !== id) {
    return res.status(403).json({
      error: "Vous n'êtes pas autorisé à supprimer cet utilisateur",
    });
  }
  // Obtenir le profil de l'utilisateur
  const profile = await db.Profile.findOne({
    where: { userId: id },
  });

  // supprimer la photo de profile dans cloudinary

  if (profile.publicId) {
    await cloudinaryRemoveImage(profile.publicId);
  }

  try {
    // Rechercher l'utilisateur à supprimer dans la base de données
    const foundUser = await db.User.findByPk(id);

    // Si l'utilisateur n'existe pas, renvoyer une erreur 404
    if (!foundUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Supprimer l'utilisateur de la base de données
    await foundUser.destroy();

    // Envoyer une réponse avec un message de succès
    res.status(200).json({ success: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    // Envoyer une réponse avec un message d'erreur
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'utilisateur" });
  }
};



/**
 * @desc Affiche  le nombre des utilisateurs dans la db
 * @route GET /api/users/count
 * @access private(only admin)
 */


const countUser = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      message: "Vous n'êtes pas autorisé",
    });
  }
  try {
    const usersCount = await db.User.count()

    res.status(200).json(usersCount);
  } catch (error) {
    console.error("Erreur serveur:", error);
    // Envoyer une réponse avec un message d'erreur
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getAlluser,
  getUserById,
  countUser
};

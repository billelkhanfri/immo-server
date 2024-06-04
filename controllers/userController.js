const db = require("../models");
const bcrypt = require("bcryptjs");
const { updateUserSchema } = require("../validation/userValidation");

/**
 * @desc Met à jour un utilisateur
 * @route PUT /api/users/:id
 * @access Private
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

    // Mettre à jour les propriétés de l'utilisateur avec les nouvelles données du corps de la requête
    const updatedData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cpi: req.body.cpi,
    };

    // Mise à jour de l'utilisateur
    await foundUser.update(updatedData);

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

module.exports = {
  updateUser,
};

const db = require("../models");
const { updateProfileSchema } = require("../validation/profileValidation");

/**
 * @desc Update user profile
 * @route PUT /api/profiles/:userId
 * @access Private
 */
const updateProfile = async (req, res) => {
  const { userId } = req.params;

  // Validation du request body avec le schema Joi
  const { error } = updateProfileSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((detail) => detail.message) });
  }

  // // Vérification que l'utilisateur connecté est bien celui qui fait la demande
  //  if (req.user.id !== parseInt(userId)) {
  //   return res.status(403).json({
  //     error: "Vous n'êtes pas autorisé à mettre à jour ce profil",
  //   });
  //  }
  console.log(req);

  try {
    // Rechercher le profil à mettre à jour dans la base de données
    const profile = await db.Profile.findOne({ where: { userId } });

    // Si le profil n'existe pas, renvoyer une erreur 404
    if (!profile) {
      return res.status(404).json({ error: "Profil non trouvé" });
    }

    // Extraire les données du corps de la requête
    const { organisation, competence, secteur } = req.body;

    // Mise à jour du profil avec les nouvelles données
    await profile.update({ organisation, competence, secteur });

    // Envoyer une réponse avec un message de succès et les données du profil mis à jour
    res.status(200).json({
      success: "Profil mis à jour avec succès",
      profile,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
};
module.exports = {
  updateProfile,
};

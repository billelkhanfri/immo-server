const db = require("../models");
const { updateProfileSchema } = require("../validation/profileValidation");
const {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} = require("../helpers/couldinary");
const path = require("path");
const fs = require("fs");

/**
 * @desc Mettre à jour le profil utilisateur
 * @route PUT /api/profiles/:userId
 * @method PUT
 * @access Privé
 */
const updateProfile = async (req, res) => {
  const { userId } = req.params;

  // Validation du corps de la requête avec le schéma Joi
  const { error } = updateProfileSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((detail) => detail.message) });
  }

  // Vérifier si l'utilisateur connecté est celui qui fait la demande
  if (req.user.id !== userId) {
    return res.status(403).json({
      error: "Vous n'êtes pas autorisé à mettre à jour ce profil",
    });
  }

  try {
    // Rechercher le profil à mettre à jour dans la base de données
    const profile = await db.Profile.findOne({ where: { userId } });

    // Si le profil n'existe pas, renvoyer une erreur 404
    if (!profile) {
      return res.status(404).json({ error: "Profil non trouvé" });
    }

    // Extraire les données du corps de la requête
    const { competence, about } = req.body;

    // Mise à jour du profil avec les nouvelles données
    await profile.update({ competence, about });

    // Envoyer une réponse avec un message de succès et les données du profil mis à jour
    res.status(200).json({
      success: "Profil mis à jour avec succès",
      profile,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
};

/**
 * @desc Téléverser une photo de profil
 * @route POST /api/profiles/profile-photo-upload
 * @method POST
 * @access Privé (seul l'utilisateur connecté)
 */
const uploadPhoto = async (req, res) => {
  // 1. Validation
  if (!req.file) {
    return res.status(400).json({ message: "Pas de photo envoyée" });
  }

  const imagePath = path.join(__dirname, `../uploads/${req.file.filename}`);

  try {
    // 3. Téléverser sur Cloudinary
    const result = await cloudinaryUploadImage(imagePath);

    // 4. Obtenir le profil de l'utilisateur depuis la base de données
    const profile = await db.Profile.findOne({
      where: { userId: req.user.id },
    });

    // 5. Supprimer l'ancienne photo de profil si elle existe
    if (profile.publicId) {
      await cloudinaryRemoveImage(profile.publicId);
    }

    // 6. Mettre à jour le profil avec la nouvelle URL de photo et l'ID public
    await profile.update({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    // 7. Envoyer une réponse au client
    res.status(200).json({
      message: "Image téléversée avec succès",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Erreur lors du téléversement de la photo :", error);
    res.status(500).json({ error: "Erreur lors du téléversement de la photo" });
  } finally {
    // 8. Nettoyer le fichier du serveur
    fs.unlinkSync(imagePath);
  }
};

module.exports = {
  updateProfile,
  uploadPhoto,
};

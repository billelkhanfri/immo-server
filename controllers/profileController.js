const db = require("../models");
const { updateProfileSchema } = require("../validation/profileValidation");
const {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} = require("../helpers/couldinary");
const path = require("path");
const fs = require("fs");

/**
 * @desc Update user profile
 * @route PUT /api/profiles/:userId
 *@method PUT
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

   // Vérification que l'utilisateur connecté est bien celui qui fait la demande
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
    const {  competence, about } = req.body;

    // Mise à jour du profil avec les nouvelles données
    await profile.update({  competence , about });

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

/**
 * @desc Profile photo upload
 * @route POST /api/profiles/profile-photo-upload
 * @method POST
 * @access Private (only logged in user)
 */

const uploadPhoto = async (req, res) => {
  // 1. Validation
  if (!req.file) {
    return res.status(400).json({ message: "pas de photo envoyer" });
  }
  // 2. get the path to the image
  const imagePath = path.join(__dirname, `../uploads/${req.file.filename}`);

  // 3. Upload to cloudinary
  const result = await cloudinaryUploadImage(imagePath);

  // 4 get the user from db
  const profile = await db.Profile.findOne({
    where: { userId: req.user.id },
  });

  // 5. delete the old profile photo if exist
  if (profile.publicId) {
    await cloudinaryRemoveImage(profile.publicId);
  }

  // 6. change the porfilePhoto filed in the db
 
      await profile.update({
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });



  fs.unlinkSync(imagePath);

  // 7 send response to client
  res.status(200).json({
    message: "Image téléversée avec succès",
    imageUrl: result.secure_url,
  });

  //8 remove image from the sever
};

module.exports = {
  updateProfile,
  uploadPhoto,
};

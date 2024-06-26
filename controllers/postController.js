const db = require("../models");

const {
  postSchema,
  updatePostSchema,
} = require("../validation/postValidation");

/**
 * @desc Créé une Offre
 * @route  /api/posts
 * @method POST
 * @access private (only logged in user)
 */

const createPost = async (req, res) => {
  // Validation du requete avec Joi
  const { error } = postSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((detail) => detail.message) });
  }
  const {
    typeDeReferral,
    natureDuContact,
    commentaire,
    honnoraire,
    honnoraireConfere,
  } = req.body;
  const userId = req.user.id; // Récupérer l'ID de l'utilisateur authentifié

  try {
    const post = await db.Post.create({
      typeDeReferral,
      natureDuContact,
      commentaire,
      honnoraire,
      honnoraireConfere,
      userId,
    });
    res.status(201).json({
      message: "Offre créée avec succès",
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createPost,
};

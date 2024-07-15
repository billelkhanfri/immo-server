const db = require("../models");

const createRating = async (req, res) => {
  const { ratingValue } = req.body;
  const { userId } = req.params; // ID de l'utilisateur à évaluer
  const evaluatorId = req.user.id; // ID de l'utilisateur qui évalue

  try {
    const user = await db.User.findOne({
      where: { id: userId },
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

    const rating = await db.Rating.create({
      ratingValue,
      profileId: user.Profile.id,
      evaluatorId,
    });

    res.status(201).json({
      success: "Évaluation créée avec succès",
      rating,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'évaluation:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'évaluation" });
  }
};

const getRatings = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await db.User.findByPk(userId, {
      include: [
        {
          model: db.Rating,
          as: "Profile",
          include: [{ model: db.User, as: "evaluator" }],
          include: { model: db.Rating, as: "ratings" },
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      success: "Évaluations récupérées avec succès",
      ratings: user.Profile.Ratings,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des évaluations:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des évaluations" });
  }
};

const updateRating = async (req, res) => {
  const { ratingValue } = req.body;
  const { ratingId } = req.params;
  const evaluatorId = req.user.id; // ID de l'utilisateur qui évalue

  try {
    const rating = await db.Rating.findByPk(ratingId);
    if (!rating) {
      return res.status(404).json({ error: "Évaluation non trouvée" });
    }

    if (rating.evaluatorId !== evaluatorId) {
      return res.status(403).json({
        error: "Vous n'êtes pas autorisé à mettre à jour cette évaluation",
      });
    }

    rating.ratingValue = ratingValue;
    await rating.save();

    res.status(200).json({
      success: "Évaluation mise à jour avec succès",
      rating,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'évaluation:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'évaluation" });
  }
};

const deleteRating = async (req, res) => {
  const { ratingId } = req.params;
  const evaluatorId = req.user.id; // ID de l'utilisateur qui évalue

  try {
    const rating = await db.Rating.findByPk(ratingId);
    if (!rating) {
      return res.status(404).json({ error: "Évaluation non trouvée" });
    }

    if (rating.evaluatorId !== evaluatorId) {
      return res.status(403).json({
        error: "Vous n'êtes pas autorisé à supprimer cette évaluation",
      });
    }

    await rating.destroy();

    res.status(200).json({ success: "Évaluation supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'évaluation:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'évaluation" });
  }
};

module.exports = {
  createRating,
  getRatings,
  updateRating,
  deleteRating,
};

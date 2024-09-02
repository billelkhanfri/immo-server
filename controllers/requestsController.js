const db = require("../models");
/**
 * @desc Récupérer les demande de referrals ouverts
 * @route GET /api/referral-requests
 * @access Private (only logged in user)
 */
const getAllRequests = async (req, res) => {
  try {
    const referralRequests = await db.ReferralRequest.findAll({});
    res.status(200).json(referralRequests);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/**
 * @desc Récupérer un request par ID
 * @route GET /api/referral-request/:id
 * @access Private (only logged in user)
 */
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const referralRequest = await db.ReferralRequest.findOne({
      where: { referralId: req.params.id },
      include: [
        {
          model: db.User,
          as: "requester",
          attributes: {
            exclude: ["password"],
          },
          include: {
            model: db.Profile,
            as: "Profile", 
          },
        },
        {
          model: db.Referral,
          as: "referral",
        }
      ],
    });
    if (referralRequest) {
      res.json(referralRequest);
    } else {
      res.status(404).json({ error: "Referral requete non trouver" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * @desc Mettre à jour le statut d'une demande de referral
 * @route PATCH /api/referrals/requests/:id
 * @access Private (only logged in user)
 */
const updateReferralRequestStatus = async (req, res) => {
  const { id } = req.params; // ID de la demande de referral
  const { status } = req.body; // 'accepted' ou 'rejected'

  // Validation de la requête
  // const { error } = updateReferralRequestStatusSchema.validate(
  //   { status },
  //   { abortEarly: false }
  // );
  // if (error) {
  //   return res
  //     .status(400)
  //     .json({ message: error.details.map((detail) => detail.message) });
  // }

  try {
    // Trouver la demande de referral en attente
    const referralRequest = await db.ReferralRequest.findOne({
      where: { id, status: "pending" },
    });
    if (!referralRequest) {
      return res
        .status(404)
        .json({ message: "Demande de referral non trouvée ou déjà traitée" });
    }

    // Mettre à jour le statut de la demande de referral
    referralRequest.status = status;
    await referralRequest.save();

    if (status === "accepted") {
      // Si la demande est acceptée, mettre à jour le referral associé
      const referral = await db.Referral.findOne({
        where: { id: referralRequest.referralId },
      });
      if (!referral) {
        return res.status(404).json({ message: "Referral non trouvé" });
      }

      referral.receiverId = referralRequest.requesterId;
      referral.status = "attribue";
      await referral.save();
    } else if (status === "rejected") {
      // Si la demande est rejetée, aucune action supplémentaire n'est nécessaire sur le referral
      res.status(200).json({
        message: "Demande de referral rejetée avec succès",
        referralRequest,
      });
      return;
    }

    res.status(200).json({
      message: "Statut de la demande de referral mis à jour avec succès",
      referralRequest,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la demande de referral:", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour de la demande de referral",
    });
  }
};

module.exports = {
  getAllRequests,
  getRequestById,
  updateReferralRequestStatus
};

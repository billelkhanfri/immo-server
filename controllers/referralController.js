const db = require("../models");
const {
  referralSchema,
  updateReferralSchema,

  updateReferralRequestStatusSchema,
} = require("../validation/referralValidation");

const getAllReferrals = async (req, res) => {
  try {
    const referrals = await db.Referral.findAll({
      include: {
        model: db.User,
        as: "sender",

        attributes: {
          exclude: ["password"],
        },
      },
    });
    res.status(200).json(referrals);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/**
 * @desc Récupérer un referral par ID
 * @route GET /api/referrals/:id
 * @access Private (only logged in user)
 */

const getReferralById = async (req, res) => {
  try {
    const referral = await db.Referral.findOne({
      where: { id: req.params.id },
      include: {
        model: db.User,
        as: "sender",
      },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!referral) {
      return res.status(404).json({ error: "Referral non trouvé" });
    }
    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({ eroor: error.message });
  }
};

/**
 * @desc Supprime un referral
 * @route DELETE /api/referrals/:id
 * @access Private (only user himself)
 */

const deleteReferral = async (req, res) => {
  const { id } = req.params;

  try {
    const referral = await db.Referral.findOne({
      where: { id },
      include: {
        model: db.User,
        as: "sender",
      },
      attributes: {
        exclude: ["password"],
      },
    });
    if (!referral) {
      return res.status(404).json({ error: "Referral non trouvé" });
    }
    if (req.user.id !== referral.senderId) {
      return res.status(403).json({
        error: "Vous n'êtes pas autorisé à supprimer le referral",
      });
    }

    // Supprimer le referral de la base de données
    await referral.destroy();
    res.status(200).json({ message: "Referral supprimer aved succé" });
  } catch (error) {
    console.error("Erreur lors de la suppression du referral:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du referral" });
  }
};

/**
 * @desc Créer un referral
 * @route POST /api/referrals
 * @access Private (only logged in user)
 */
const createReferral = async (req, res) => {
  // Validation de la requête
  const { error } = referralSchema.validate(req.body, { abortEarly: false });
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
    price,
    receiverId,
  } = req.body;
  const senderId = req.user.id;

  try {
    const referral = await db.Referral.create({
      typeDeReferral,
      natureDuContact,
      commentaire,
      honnoraire,
      price,
      senderId,
      receiverId: receiverId || null,
      status: receiverId ? "attribue" : "open", // Si receiverId est fourni, le statut est 'attribue', sinon 'open'
    });
    res.status(201).json({ message: "Referral créé avec succès", referral });
  } catch (error) {
    console.error("Erreur lors de la création du referral:", error);
    res.status(500).json({ error: "Erreur lors de la création du referral" });
  }
};

/**
 * @desc Demander un referral
 * @route POST /api/referrals/:id/request
 * @access Private (only logged in user)
 */
const requestReferral = async (req, res) => {
  const { id } = req.params; // ID du referral
  const requesterId = req.user.id;

  try {
    const isExistingRequest = await db.ReferralRequest.findOne({
      where: { requesterId, referralId: id },
    });

    if (isExistingRequest) {
      return res
        .status(401)
        .json({ message: "vous avez déja envoyer une demande a ce referral" });
    }
    const referral = await db.Referral.findOne({
      where: { id, status: "open" },
    });
    if (!referral) {
      return res
        .status(404)
        .json({ message: "Referral non trouvé ou déjà attribué" });
    }
    const { senderId } = referral;
    const referralRequest = await db.ReferralRequest.create({
      referralId: id,
      requesterId,
      status: "pending",
      senderId,
    });

    res.status(201).json({
      message: "Demande de referral envoyée avec succès",
      referralRequest,
    });
  } catch (error) {
    console.error("Erreur lors de la demande de referral:", error);
    res.status(500).json({ error: "Erreur lors de la demande de referral" });
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

  //Validation de la requête
  const { error } = updateReferralRequestStatusSchema.validate(
    { status },
    { abortEarly: false }
  );
  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((detail) => detail.message) });
  }

  try {
    const referralRequest = await db.ReferralRequest.findOne({
      where: { id, status: "pending" },
    });
    if (!referralRequest) {
      return res
        .status(404)
        .json({ message: "Demande de referral non trouvée ou déjà traitée" });
    }

    referralRequest.status = status;
    await referralRequest.save();

    if (status === "accepted") {
      const referral = await db.Referral.findOne({
        where: { id: referralRequest.referralId },
      });
      if (!referral) {
        return res.status(404).json({ message: "Referral non trouvé" });
      }

      referral.receiverId = referralRequest.requesterId;
      referral.status = "attribue";
      await referral.save();

      await db.ReferralRequest.update(
        { status: "rejected" },
        { where: { referralId: referral.id, status: "pending" } }
      );
    }

    res.status(200).json({
      message: "Statut de la demande de referral mis à jour",
      referralRequest,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la demande de referral:",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la mise à jour de la demande de referral",
    });
  }
};

/**
 * @desc Mettre à jour le statut d'un referral
 * @route PATCH /api/referrals/:id/status
 * @access Private (only logged in user)
 */
const updateReferralStatus = async (req, res) => {
  const { id } = req.params; // id du Referral
  const { status } = req.body;

  //Validation de la requête
  const { error } = updateReferralSchema.validate(
    { status },
    { abortEarly: false }
  );
  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((detail) => detail.message) });
  }

  try {
    const referral = await db.Referral.findOne({ where: { id } });
    if (!referral) {
      return res.status(404).json({ message: "Referral non trouvé" });
    }
    if (referral.receiverId === null) {
      return res.status(403).json({
        message: "il faut une attribution du referral avant de continuer",
      });
    }

    referral.status = status;
    await referral.save();

    res
      .status(200)
      .json({ message: "Statut du referral mis à jour", referral });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut du referral:",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du statut du referral" });
  }
};

module.exports = {
  createReferral,
  requestReferral,
  updateReferralRequestStatus,
  updateReferralStatus,
  getAllReferrals,
  getReferralById,
  deleteReferral,
};

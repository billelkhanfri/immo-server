const db = require("../models");
const {
  referralSchema,
  updateReferralSchema,
} = require("../validation/referralValidation");

/**
 * @desc Créé un referral
 * @route  /api/referrals
 * @method POST
 * @access private (only logged in user)
 */
const createReferral = async (req, res) => {
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
      status: receiverId ? "assigned" : "open", // Si receiverId est fourni, le statut est 'assigned', sinon 'open'
    });
    res.status(201).json({ message: "Referral créé avec succès", referral });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Demander un referral
 * @route  /api/referrals/:id/request
 * @method POST
 * @access private (only logged in user)
 */
const requestReferral = async (req, res) => {
  const { id } = req.params; // ID du referral
  const requesterId = req.user.id;

  try {
    const referral = await db.Referral.findOne({
      where: { id, status: "open" },
    });
    if (!referral)
      return res
        .status(404)
        .json({ message: "Referral non trouvé ou déjà attribué" });

    const referralRequest = await db.ReferralRequest.create({
      referralId: id,
      requesterId,
      status: "pending",
    });

    res.status(201).json({
      message: "Demande de referral envoyée avec succès",
      referralRequest,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Mettre à jour le statut d'une demande de referral
 * @route  /api/referrals/requests/:id
 * @method PATCH
 * @access private (only logged in user)
 */
const updateReferralRequestStatus = async (req, res) => {
  const { id } = req.params; // ID de la demande de referral
  const { status } = req.body; // 'accepted' ou 'rejected'

  try {
    const referralRequest = await db.ReferralRequest.findOne({
      where: { id, status: "pending" },
    });
    if (!referralRequest)
      return res
        .status(404)
        .json({ message: "Demande de referral non trouvée ou déjà traitée" });

    referralRequest.status = status;
    await referralRequest.save();

    if (status === "accepted") {
      const referral = await db.Referral.findOne({
        where: { id: referralRequest.referralId },
      });
      referral.receiverId = referralRequest.requesterId;
      referral.status = "assigned";
      await referral.save();
    }

    res.status(200).json({
      message: "Statut de la demande de referral mis à jour",
      referralRequest,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Mettre à jour le statut d'un referral
 * @route  /api/referrals/:id/status
 * @method PATCH
 * @access private (only logged in user)
 */
const updateReferralStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

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
    if (!referral)
      return res.status(404).json({ message: "Referral non trouvé" });

    referral.status = status;
    await referral.save();

    res
      .status(200)
      .json({ message: "Statut du referral mis à jour", referral });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReferral,
  requestReferral,
  updateReferralRequestStatus,
  updateReferralStatus,
};

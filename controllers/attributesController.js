const db = require("../models");

/**
 * @desc Récupérer les Referrals attribuers
 * @route GET /api/referrals-attributes/
 * @access Private (only logged in user)
 */

const getAllAttributes = async (req,res) => {
  try {
    const attributes = await db.ReferralAttributes.findAll({ 
        
      include: [
        {
          model: db.User,
          as: "received",
          attributes: { exclude: ["password"] },
          include: {
            model: db.Profile,
            as: "Profile",
          },
        },
        {
          model: db.User,
          as: "sender",
          attributes: { exclude: ["password"] },
          include: {
            model: db.Profile,
            as: "Profile",
          },
        },
        {
          model: db.Referral,
          as: "referral",
          attributes: { exclude: ["password"] },
        },
      ],
    }
    );
    res.status(200).json(attributes);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};




const getAttributeById = async (req, res) => {
  try {
    const { id } = req.params; // Assuming this is the referralId
    console.log("Fetching attributes for referralId:", id); // Log the ID


    // Fetch all attributes associated with the provided referralId
    const attributes = await db.ReferralAttributes.findAll({
      where: { referralId: id },
      include: [
        {
          model: db.User,
          as: "received",
          attributes: { exclude: ["password"] },
          include: {
            model: db.Profile,
            as: "Profile",
          },
        },
        {
          model: db.User,
          as: "sender",
          attributes: { exclude: ["password"] },
          include: {
            model: db.Profile,
            as: "Profile",
          },
        },
        {
          model: db.Referral,
          as: "referral",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    // If no attributes are found, return a 404 response
    if (!attributes || attributes.length === 0) {
      return res.status(404).json({ error: "No referral attributes found for this referral ID" });
    }

    // Return the list of attributes
    res.status(200).json(attributes);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: process.env.NODE_ENV === 'development' ? error.message : "Erreur serveur" });
  }
};
/**
 * @desc Mettre à jour le statut d'un ReferralAttributes
 * @route PUT /api/referrals-attributes/:id
 * @access Private (only logged in user)
 */
const updateReferralAttributeStatus = async (req, res) => {
  const { id } = req.params; // ReferralAttribute ID
  const { status } = req.body; // "accepted" or "rejected"
  const userId = req.user.id;

  try {
    // Fetch the ReferralAttribute by ID
    const referralAttribute = await db.ReferralAttributes.findOne({ 
      where: { referralId: id , receivedId : userId}});

    if (!referralAttribute) {
      return res.status(404).json({ error: "ReferralAttribute introuvable" });
    }

    // Update the status to either accepted or rejected
    referralAttribute.status = status;
    await referralAttribute.save();

    // If the status is "accepted", update the Referral's status to "attribué"
    if (status === "accepted") {
      const referral = await db.Referral.findByPk(referralAttribute.referralId);

      if (!referral) {
        return res.status(404).json({ error: "Referral introuvable" });
      }

      referral.status = "attribué"
      referral.isPending = false;
      referral.receiverId = referralAttribute.receivedId
      await referral.save();
    }

    // Return the updated ReferralAttribute
    res.status(200).json({
      message: `ReferralAttribute mis à jour avec le statut ${status}`,
      referralAttribute,
    });
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour du ReferralAttribute" });
  }
};

module.exports = {
  getAttributeById,
  getAllAttributes,  updateReferralAttributeStatus,

};

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

module.exports = {
  getAllAttributes,
};

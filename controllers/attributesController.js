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


module.exports = {
  getAttributeById,
  getAllAttributes
};

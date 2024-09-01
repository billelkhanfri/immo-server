const db = require("../models");
/**
 * @desc Récupérer les demande de referrals ouverts
 * @route GET /api/referral-requests
 * @access Private (only logged in user)
 */
const getAllRequests = async (req, res) => {
  try {
    const referralRequests = await db.ReferralRequest.findAll({
      
    });
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
    const referralRequest = await db.ReferralRequest.findByPk(id);
    if (referralRequest) {
      res.json(referralRequest);
    } else {
      res.status(404).json({ error: "Referral requete non trouver" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllRequests,
  getRequestById,
};

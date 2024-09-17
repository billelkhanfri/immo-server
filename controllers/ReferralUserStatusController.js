const { ReferralUserStatus } = require('../models');

// Update Referral Status for a User
exports.updateReferralUserStatus = async (req, res) => {
  const { referralId, userId, status } = req.body;

  try {
    // Find or create the ReferralUserStatus for this user and referral
    let referralUserStatus = await ReferralUserStatus.findOne({
      where: { referralId, userId },
    });

    if (!referralUserStatus) {
      referralUserStatus = await ReferralUserStatus.create({ referralId, userId, status });
    } else {
      // Update the status
      referralUserStatus.status = status;
      await referralUserStatus.save();
    }

    return res.status(200).json(referralUserStatus);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating referral status' });
  }
};

// Get the status of a referral for a specific user
exports.getReferralUserStatus = async (req, res) => {
  const { referralId, userId } = req.params;

  try {
    const referralUserStatus = await ReferralUserStatus.findOne({
      where: { referralId, userId },
    });

    if (!referralUserStatus) {
      return res.status(404).json({ message: 'No status found for this referral and user' });
    }

    return res.status(200).json(referralUserStatus);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching referral status' });
  }
};

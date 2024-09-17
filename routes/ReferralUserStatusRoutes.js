const express = require('express');
const router = express.Router();
const referralUserStatusController = require('../controllers/ReferralUserStatusController');

// Update referral status for a specific user
router.post('api/referral-status', referralUserStatusController.updateReferralUserStatus);

// Get referral status for a specific user
router.get('api/referral-status/:referralId/:userId', referralUserStatusController.getReferralUserStatus);

module.exports = router;

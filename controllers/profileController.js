const db = require("../models");
const { updateProfileSchema } = require("../validation/profileValidation");

/**
 * @desc Update user profile
 * @route PUT /api/profiles/:userId
 * @access Private
 */
const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { error } = updateProfileSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((detail) => detail.message) });
  }

  try {
    const profile = await db.Profile.findOne({ where: { userId } });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const { organisation, image, competence, secteur } = req.body;

    profile.organisation = organisation || profile.organisation;
    profile.image = image || profile.image;
    profile.competence = competence || profile.competence;
    profile.secteur = secteur || profile.secteur;

    await profile.save();
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateProfile,
};

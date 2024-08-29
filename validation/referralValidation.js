const Joi = require("joi");

// validate create post
const referralSchema = Joi.object({
  typeDeReferral: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Le Type de referral ne peut pas être vide",
    "string.min": "Le Type de referral doit contenir au moins 3 caractères",
    "string.max": "Le Type de referral doit contenir au maximum 25 caractères",
    "any.required": "Le Type de referral est requis",
  }),
  natureDuContact: Joi.string().min(3).max(25).required().messages({
    "string.empty": "La nature du contact ne peut pas être vide",
    "string.min": "La nature du contact doit contenir au moins 3 caractères",
    "string.max": "La nature du contact doit contenir au maximum 25 caractères",
    "any.required": "La nature du contact est requis",
  }),
  lieu: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Le lieu du referral ne peut pas être vide",
    "string.min": "Le lieu du referral doit contenir au moins 3 caractères",
    "string.max": "Le lieu du referral doit contenir au maximum 25 caractères",
    "any.required": "Le lieu du referral est requis",
  }),
  commentaire: Joi.string().allow("").optional().messages({
    "string.empty": "Le commentaire ne peut pas être vide",
  }),
  honnoraire: Joi.number().required().messages({
    "string.empty": "Le honnoraire ne peut pas être vide",
    "any.required": "Le honnoraire est requis",
  }),
  price: Joi.number().required().messages({
    "string.empty": "Le prix ne peut pas être vide",
    "any.required": "Le prix est requis",
  }),
  receiverId: Joi.string().allow(null, "").optional().messages({
    "string.empty": "Le receiverId ne peut pas être vide",
  }),
});

// validate update referral status
const updateReferralSchema = Joi.object({
  status: Joi.string()
    .valid(
      "open",
      "attribue",
      "pourparlers",
      "mondat",
      "compromis",
      "acte",
      "rejected"
    )
    .default("open"),
});

//validate update request of referral
const updateReferralRequestStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "accepted", "rejected")
    .default("pending"),
});

module.exports = {
  referralSchema,
  updateReferralSchema,
  updateReferralRequestStatusSchema,
};

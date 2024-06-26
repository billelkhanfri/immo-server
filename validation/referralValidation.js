const Joi = require("joi");

// validate create post
const referralSchema = Joi.object({
  typeDeReferral: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Le Type de referral  ne peut pas être vide",
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

  commentaire: Joi.string(),
  honnoraire: Joi.number().required().messages({
    "string.empty": "Le honnoraire ne peut pas être vide",
    "any.required": "Le honnoraire est requis",
  }),
  honnoraireConfere: Joi.number().required().messages({
    "string.empty": "Le honnoraire confrére ne peut pas être vide",
    "any.required": "Le honnoraire confrére est requis",
  }),
});

// validate update post
const updateReferralSchema = Joi.object({
  typeDeReferral: Joi.string().min(3).max(25).messages({
    "string.empty": "Le Type de referral  ne peut pas être vide",
    "string.min": "Le Type de referral doit contenir au moins 3 caractères",
    "string.max": "Le Type de referral doit contenir au maximum 25 caractères",
    "any.required": "Le Type de referral est requis",
  }),
  natureDuContact: Joi.string().min(3).max(25).messages({
    "string.empty": "La nature du contact ne peut pas être vide",
    "string.min": "La nature du contact doit contenir au moins 3 caractères",
    "string.max": "La nature du contact doit contenir au maximum 25 caractères",
    "any.required": "La nature du contact est requis",
  }),

  commentaire: Joi.number().min(8),
  honnoraire: Joi.string().min(3).max(255).messages({
    "string.empty": "Le honnoraire ne peut pas être vide",
    "any.required": "Le honnoraire est requis",
  }),
  honnoraireConfere: Joi.number().min(6).messages({
    "string.empty": "Le honnoraire confrére ne peut pas être vide",
    "any.required": "Le honnoraire confrére est requis",
  }),
});

module.exports = {
  referralSchema,
  updateReferralSchema,
};

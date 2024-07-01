const Joi = require("joi");

// Schéma de validation pour la mise à jour du profil
const updateProfileSchema = Joi.object({
  // Validation du champ "competence"
  competence: Joi.string().min(3).max(255).messages({
    "string.min": "Le champ de compétence doit contenir au moins 3 caractères",
    "string.max":
      "Le champ de compétence doit contenir au maximum 255 caractères",
  }),
  // Validation du champ "about"
  about: Joi.string().min(3).max(1000).messages({
    "string.min": "Le champ 'à propos' doit contenir au moins 3 caractères",
    "string.max":
      "Le champ 'à propos' doit contenir au maximum 1000 caractères",
  }),
});

module.exports = { updateProfileSchema };

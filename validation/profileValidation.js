const Joi = require("joi");

const updateProfileSchema = Joi.object({
  organisation: Joi.string().min(3).max(255).messages({
    "string.min":
      "Le nom de l'organisation doit contenir au moins 3 caractères",
    "string.max":
      "Le nom de l'organisation doit contenir au maximum 255 caractères",
  }),
  // image: Joi.string().min(3).max(255).messages({
  //   "string.min": "Le chemin de l'image doit contenir au moins 3 caractères",
  //   "string.max":
  //     "Le chemin de l'image doit contenir au maximum 255 caractères",
  // }),
  competence: Joi.string().min(3).max(255).messages({
    "string.min": "Le champ de compétence doit contenir au moins 3 caractères",
    "string.max":
      "Le champ de compétence doit contenir au maximum 255 caractères",
  }),
  secteur: Joi.string().min(3).max(255).messages({
    "string.min": "Le secteur doit contenir au moins 3 caractères",
    "string.max": "Le secteur doit contenir au maximum 255 caractères",
  }),
});

module.exports = { updateProfileSchema };

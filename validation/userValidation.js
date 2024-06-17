const Joi = require("joi");

const registerSchema = Joi.object({
  lastName: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Le nom d'utilisateur ne peut pas être vide",
    "string.min": "Le nom d'utilisateur doit contenir au moins 3 caractères",
    "string.max": "Le nom d'utilisateur doit contenir au maximum 25 caractères",
    "any.required": "Le nom d'utilisateur est requis",
  }),
  firstName: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Le prénom d'utilisateur ne peut pas être vide",
    "string.min":
      "Le prénom  d'utilisateur doit contenir au moins 3 caractères",
    "string.max":
      "Le prénom  d'utilisateur doit contenir au maximum 25 caractères",
    "any.required": "Le prénom d'utilisateur est requis",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "L'email ne peut pas être vide",
    "string.email": "L'email doit être une adresse valide",
    "any.required": "L'email est requis",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Le mot de passe ne peut pas être vide",
    "string.min": "Le mot de passe doit contenir au moins 8 caractères",
    "any.required": "Le mot de passe est requis",
  }),
  cpi: Joi.string().min(6).required().messages({
    "string.empty": "Le CPI ne peut pas être vide",
    "any.required": "Le CPI est requis",
    "string.min": "Le CPI doit contenir au moins 6 caractères",
  }),
  termsAccepted: Joi.boolean().valid(true).required().messages({
    "any.only": "Vous devez accepter les conditions générales.",
  }),
});

const loginSchema = Joi.object({
  emailorcpi: Joi.alternatives()
    .try(
      Joi.string().email().messages({
        "string.empty": "L'email ne peut pas être vide",
        "string.email": "L'email doit être une adresse valide",
      }),
      Joi.string()
        .pattern(/^\d{8}$/)
        .messages({
          "string.empty": "Le CPI ne peut pas être vide",
        })
    )
    .required()
    .messages({ "any.required": "L'email ou le CPI est requis" }),
});

const updateUserSchema = Joi.object({
  lastName: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Le nom d'utilisateur ne peut pas être vide",
    "string.min": "Le nom d'utilisateur doit contenir au moins 3 caractères",
    "string.max": "Le nom d'utilisateur doit contenir au maximum 25 caractères",
    "any.required": "Le nom d'utilisateur est requis",
  }),
  firstName: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Le prénom d'utilisateur ne peut pas être vide",
    "string.min":
      "Le prénom  d'utilisateur doit contenir au moins 3 caractères",
    "string.max":
      "Le prénom  d'utilisateur doit contenir au maximum 25 caractères",
    "any.required": "Le prénom d'utilisateur est requis",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Le mot de passe ne peut pas être vide",
    "string.min": "Le mot de passe doit contenir au moins 6 caractères",
    "any.required": "Le mot de passe est requis",
  }),
  cpi: Joi.string().required().messages({
    "string.empty": "Le CPI ne peut pas être vide",
    "any.required": "Le CPI est requis",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
};

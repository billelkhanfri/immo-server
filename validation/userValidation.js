const Joi = require("joi");

// Schéma de validation pour l'enregistrement d'un utilisateur
const registerSchema = Joi.object({
  lastName: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Le nom ne peut pas être vide",
    "string.min": "Le nom doit contenir au moins 3 caractères",
    "string.max": "Le nom doit contenir au maximum 25 caractères",
    "any.required": "Le nom est requis",
  }),
  firstName: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Le prénom ne peut pas être vide",
    "string.min": "Le prénom doit contenir au moins 3 caractères",
    "string.max": "Le prénom doit contenir au maximum 25 caractères",
    "any.required": "Le prénom est requis",
  }),
  organisation: Joi.string().min(3).max(255).messages({
    "string.min":
      "Le nom de l'organisation doit contenir au moins 3 caractères",
    "string.max":
      "Le nom de l'organisation doit contenir au maximum 255 caractères",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "L'email ne peut pas être vide",
    "string.email": "L'email doit être une adresse valide",
    "any.required": "L'email est requis",
  }),
  telephone: Joi.string()
    .pattern(/^\d+$/) // Vérifie que le numéro de téléphone contient uniquement des chiffres
    .min(10) // Minimum de 10 chiffres
    .max(15) // Maximum de 15 chiffres
    .required()
    .messages({
      "string.empty": "Le téléphone ne peut pas être vide",
      "string.pattern.base":
        "Le numéro de téléphone doit contenir uniquement des chiffres",
      "string.min": "Le numéro de téléphone doit contenir au moins 10 chiffres",
      "string.max": "Le numéro de téléphone ne doit pas dépasser 15 chiffres",
      "any.required": "Le téléphone est requis",
    }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Le mot de passe ne peut pas être vide",
    "string.min": "Le mot de passe doit contenir au moins 8 caractères",
    "any.required": "Le mot de passe est requis",
  }),
  secteur: Joi.string().min(3).max(255).messages({
    "string.min": "Le secteur doit contenir au moins 3 caractères",
    "string.max": "Le secteur doit contenir au maximum 255 caractères",
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

// Schéma de validation pour la connexion d'un utilisateur
const loginSchema = Joi.object({
  emailOrCpi: Joi.alternatives()
    .try(
      Joi.string().email().messages({
        "string.empty": "L'email ne peut pas être vide",
        "string.email": "L'email doit être une adresse valide",
      }),
      Joi.string().min(6).required().messages({
        "string.empty": "Le CPI ne peut pas être vide",
        "any.required": "Le CPI est requis",
        "string.min": "Le CPI doit contenir au moins 6 caractères",
      })
    )
    .required()
    .messages({ "any.required": "L'email ou le CPI est requis" }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Le mot de passe ne peut pas être vide",
    "string.min": "Le mot de passe doit contenir au moins 8 caractères",
    "any.required": "Le mot de passe est requis",
  }),
});

// Schéma de validation pour la mise à jour d'un utilisateur
const updateUserSchema = Joi.object({
  lastName: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Le nom ne peut pas être vide",
    "string.min": "Le nom doit contenir au moins 3 caractères",
    "string.max": "Le nom doit contenir au maximum 25 caractères",
    "any.required": "Le nom est requis",
  }),
  firstName: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Le prénom ne peut pas être vide",
    "string.min": "Le prénom doit contenir au moins 3 caractères",
    "string.max": "Le prénom doit contenir au maximum 25 caractères",
    "any.required": "Le prénom est requis",
  }),
  organisation: Joi.string().min(3).max(255).messages({
    "string.min":
      "Le nom de l'organisation doit contenir au moins 3 caractères",
    "string.max":
      "Le nom de l'organisation doit contenir au maximum 255 caractères",
  }),
  telephone: Joi.string()
    .pattern(/^\d+$/) // Vérifie que le numéro de téléphone contient uniquement des chiffres
    .min(10) // Minimum de 10 chiffres
    .max(15) // Maximum de 15 chiffres
    .required()
    .messages({
      "string.empty": "Le téléphone ne peut pas être vide",
      "string.pattern.base":
        "Le numéro de téléphone doit contenir uniquement des chiffres",
      "string.min": "Le numéro de téléphone doit contenir au moins 10 chiffres",
      "string.max": "Le numéro de téléphone ne doit pas dépasser 15 chiffres",
      "any.required": "Le téléphone est requis",
    }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Le mot de passe ne peut pas être vide",
    "string.min": "Le mot de passe doit contenir au moins 8 caractères",
    "any.required": "Le mot de passe est requis",
  }),
  secteur: Joi.string().min(3).max(255).messages({
    "string.min": "Le secteur doit contenir au moins 3 caractères",
    "string.max": "Le secteur doit contenir au maximum 255 caractères",
  }),
  cpi: Joi.string().min(6).required().messages({
    "string.empty": "Le CPI ne peut pas être vide",
    "any.required": "Le CPI est requis",
    "string.min": "Le CPI doit contenir au moins 6 caractères",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
};

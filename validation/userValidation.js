const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 25 characters long",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty",
    "string.email": "Must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  cpi: Joi.string().min(6).required().messages({
    "string.empty": "CPI cannot be empty",
    "any.required": "CPI is required",
    "string.min": "CPI must be at least 6 characters long",
  }),
});

module.exports = {
  registerSchema,
};

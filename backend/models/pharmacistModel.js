const Joi = require("joi");

const pharmacistSchema = Joi.object({
  pharmacistID: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid("Erkek", "Kadın", "Diğer").required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { pharmacistSchema };

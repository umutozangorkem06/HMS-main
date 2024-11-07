const Joi = require("joi");

const doctorSchema = Joi.object({
  doctorID: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid("Erkek", "Kadın", "Diğer").required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string().required(),
  departmentID: Joi.number().integer().required(),
});

module.exports = { doctorSchema };

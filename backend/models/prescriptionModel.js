const Joi = require("joi");

const prescriptionSchema = Joi.object({
  prescriptionID: Joi.number().required(),
  patientID: Joi.string().required(),
  pharmacistID: Joi.string().required(),
  prescriptionDate: Joi.date().required(),
  medicationDetails: Joi.string().required(),
});

module.exports = { prescriptionSchema };

const Joi = require("joi");


const appointmentSchema = Joi.object({
    patientID: Joi.string().uuid().required(),
    doctorID: Joi.number().integer().required(),
    appointmentDate: Joi.date().required(),
    departmentID: Joi.number().integer().required(),
  });
  
  module.exports = { appointmentSchema };
  
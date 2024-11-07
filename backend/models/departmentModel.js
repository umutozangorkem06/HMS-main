const Joi = require("joi");

const departmentSchema = Joi.object({
  departmentName: Joi.string().required(),
});

module.exports = { departmentSchema };

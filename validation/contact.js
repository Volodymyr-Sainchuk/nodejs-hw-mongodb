import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phone: Joi.number().integer().required(),
  email: Joi.string().min(3).max(20).required(),
  job: Joi.string().min(3).max(20).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phone: Joi.number().integer(),
  email: Joi.string().min(3).max(20),
  job: Joi.string().min(3).max(20),
});

import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+380\d{9}$/)
    .required(),
  email: Joi.string().email().required(),
  contactType: Joi.string().valid('personal', 'work').required(),
  isFavourite: Joi.boolean().default(false),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.string().pattern(/^\+380\d{9}$/),
  email: Joi.string().email(),
  contactType: Joi.string().valid('personal', 'work'),
  isFavourite: Joi.boolean(),
}).min(1);

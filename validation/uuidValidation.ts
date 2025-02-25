import Joi from 'joi';

export const uuidSchema = Joi.object({
  uuid: Joi.string().uuid().required()
});
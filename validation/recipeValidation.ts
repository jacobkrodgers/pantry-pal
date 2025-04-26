import Joi from 'joi';
import {diets} from '@/utils/lists/diets'

/**
 * Schema for validating a new recipe sent in the request body.
 */
export const newRecipeSchema = Joi.object({
  name: Joi.string().required(),
  ingredients: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      quantityUnit: Joi.string().required(),
      quantity: Joi.number().required().positive(),
      form: Joi.string().required()
    })
  ),
  instructions: Joi.string().required(),
  prepTime: Joi.string().optional(),
  cookTime: Joi.string().optional(),
  dietTags: Joi.array().items(
    Joi.string().valid(...diets)
  ).optional(),
  isPublic: Joi.boolean().optional()
});

export const dietTagSchema = Joi
        .array()
        .items(Joi
                .string()
                .valid(...diets)
            )
        .optional()
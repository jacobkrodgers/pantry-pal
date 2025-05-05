import Joi from 'joi';
import {diets} from '@/utils/lists/diets'

/**
 * Schema for validating a new recipe sent in the request body.
 */
export const newRecipeSchema = Joi.object({
  name: Joi
            .string()
            .pattern(/^[A-Za-z0-9 ]+$/)
            .required(),
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

export const recipeNameSchema = Joi
        .string()
        .pattern(/^[A-Za-z0-9 ]+$/)
        .required()
        .messages({
            'any.required': 'Required',
            'string.pattern.base': 'Recipe names may only include letters, numbers, and spaces',
            'any.empty': 'Required',
            'string.empty': 'Required'
        })

export const numberSchema = Joi
        .number()
        .required()
        .positive()
        .messages({
            'any.required': 'Required',
            'any.number' : 'Must be a number',
            'string.empty': 'Required',
            'number.positive': 'Must be positive'
        })

export const timeUnitSchema = Joi
        .string()
        .required()
        .valid('seconds', 'minutes', 'hours', 'days', 'weeks')
        .messages({
            'any.required': 'Required',
            'any.only': 'Invalid Time Unit',
            'string.empty': 'Required'
        })
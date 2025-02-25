import Joi from 'joi';

/**
 * Schema for validating a new recipe sent in the request body.
 */
export const newRecipeSchema = Joi.object({
  name: Joi.string().required(),
  ingredients: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      quantityUnit: Joi.string().required(),
      quantity: Joi.number().required(),
      form: Joi.string().required()
    })
  ),
  instructions: Joi.string().required(),
  prepTime: Joi.string().optional(),
  cookTime: Joi.string().optional(),
  Diet: Joi.array().items(
    Joi.string().valid("vegan", "vegetarian", "carnivore", "omnivore")
  ).optional()
});

/**
 * JOI schema for validating the recipe update payload.
 * This schema allows updating of the following fields: name, ingredients, instructions, prepTime,
 * cookTime, and dietCompatibility. Fields such as owner and dateAdded are not permitted.
 * @summary Validates the recipe update payload.
 */
export const recipeUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  ingredients: Joi.array().items(
    Joi.object({
      id: Joi.string().uuid().required(), 
      name: Joi.string().required(),
      quantityUnit: Joi.string().required(),
      quantity: Joi.number().required(),
      form: Joi.string().required()
    })
  ).optional(),
  instructions: Joi.string().optional(),
  prepTime: Joi.string().optional(),
  cookTime: Joi.string().optional(),
  dietCompatibility: Joi.array().items(
    Joi.string().valid("vegan", "vegetarian", "carnivore", "omnivore")
  ).optional()
});


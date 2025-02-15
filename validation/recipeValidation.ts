import Joi from 'joi';

/**
 * JOI schema for validating the recipe ID.
 * @summary Validates that the recipe ID is a valid UUID.
 */
export const recipeIdSchema = Joi.object({
  id: Joi.string().uuid().required()
});

/**
 * JOI schema for validating the API key provided in the request headers.
 * @summary Validates that the API key is a valid UUID.
 */
export const apiKeySchema = Joi.object({
  apiKey: Joi.string().uuid().required()
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

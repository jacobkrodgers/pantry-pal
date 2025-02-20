import { Recipe, RecipeControllerResponse } from "@/type/Recipe";
import {
    find_recipe_by_id, 
    update_recipe_by_id, 
    delete_recipe_by_id
        } from "@/model/recipe_model";
import { get_user_by_api_key } from "@/model/userModel";
import { ServerUser } from "@/type/User"; // adjust import if needed
import { GenericAPIResponse } from "@/type/Generic";

/**
 * Retrieves a recipe by its ID.
 * @summary Get a specific recipe by ID.
 * @param id - The UUID of the recipe.
 * @param apiKey - The API key for authentication.
 * @returns A response object that returns a payload with a recipe if successful.
 * @returns A response containing an HTTP status code and error message.
 */
export async function getRecipeById(id: string, apiKey: string):
    Promise<RecipeControllerResponse | GenericAPIResponse> 
{
    // Get server user from the database using API Key
    const user: ServerUser | null = await get_user_by_api_key(apiKey);
    if (!user) return {payload: "Unauthorized", status: 401};

    // Get recipe from the database using recipe id
    const recipe = await find_recipe_by_id(id);
    if (!recipe) return {payload: "Not Found", status: 404}

    // TODO: Check if the recipe belongs to the user

    return {payload: recipe, status: 200};
}

/**
 * Updates an existing recipe by its UUID.
 * @summary Update a specific recipe by ID.
 * @param id - The UUID of the recipe.
 * @param apiKey - The API key for authentication.
 * @param updateData - An object containing updated recipe details.
 * @returns A promise resolving to the updated recipe, or null.
 * @throws Error if the API key is invalid.
 */
export async function updateRecipe(
  id: string,
  apiKey: string,
  updateData: any
): Promise<Recipe | null> {
  const user: ServerUser | null = await verify_api_key(apiKey);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return await update_recipe_by_id(id, updateData);
}

/**
 * Deletes a recipe by its UUID.
 * @summary Delete a specific recipe by ID.
 * @param id - The UUID of the recipe.
 * @param apiKey - The API key for authentication.
 * @returns A promise resolving to the deleted recipe, or null.
 * @throws Error if the API key is invalid.
 */
export async function deleteRecipe(
  id: string,
  apiKey: string
): Promise<Recipe | null> {
  const user: ServerUser | null = await verify_api_key(apiKey);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return await delete_recipe_by_id(id);
}

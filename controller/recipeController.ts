import { Recipe } from "@/type/Recipe";
import {
  find_recipe_by_id,
  update_recipe_by_id,
  delete_recipe_by_id,
} from "@/model/recipe_model";
import { verify_api_key } from "@/model/userModel";
import { ServerUser } from "@/type/User"; // adjust import if needed

/**
 * Retrieves a recipe by its UUID.
 * @summary Get a specific recipe by ID.
 * @param id - The UUID of the recipe.
 * @param apiKey - The API key for authentication.
 * @returns A promise resolving to the recipe if found, or null.
 * @throws Error if the API key is invalid.
 */
export async function getRecipeById(
  id: string,
  apiKey: string
): Promise<Recipe | null> {
  const user: ServerUser | null = await verify_api_key(apiKey);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return await find_recipe_by_id(id);
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

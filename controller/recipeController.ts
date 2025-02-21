// controller/recipeController.ts
import { Recipe, RecipeControllerResponse } from "@/type/Recipe";
import {
  find_recipe_by_id,
  update_recipe_by_id,
  delete_recipe_by_id,
} from "@/model/recipe_model";
import { get_user_by_api_key } from "@/model/userModel";
import { ServerUser } from "@/type/User";
import { GenericAPIResponse } from "@/type/Generic";

/**
 * Retrieves a recipe by its ID.
 * @summary Get a specific recipe by ID.
 * @param id - The UUID of the recipe.
 * @param apiKey - The API key for authentication.
 * @returns A response object with the recipe if successful,
 *          or an error response.
 */
export async function getRecipeById(
  id: string,
  apiKey: string
): Promise<RecipeControllerResponse | GenericAPIResponse> {
  const user: ServerUser | null = await get_user_by_api_key(apiKey);
  if (!user) return { payload: "Unauthorized", status: 401 };

  const recipe = await find_recipe_by_id(id);
  if (!recipe) return { payload: "Not Found", status: 404 };
  if (recipe.userId !== user.id)
    return { payload: "Forbidden", status: 403 };

  return { payload: recipe, status: 200 };
}

/**
 * Updates an existing recipe by its ID.
 * @summary Update a specific recipe by ID.
 * @param id - The UUID of the recipe.
 * @param apiKey - The API key for authentication.
 * @param updateData - An object containing updated recipe details.
 *        Ingredients have an optional id property.
 * @returns A response object with the updated recipe if successful,
 *          or an error response.
 */
export async function updateRecipe(
  id: string,
  apiKey: string,
  updateData: {
    name: string;
    ingredients: {
      id: string; // now required
      name: string;
      quantityUnit: string;
      quantity: number;
      form: string;
    }[];
    instructions: string;
    prepTime: string;
    cookTime: string;
    dietCompatibility: (string | { id: string; name: string })[];
  }
): Promise<RecipeControllerResponse | GenericAPIResponse> {
  // Check if the user is authorized
  const user: ServerUser | null = await get_user_by_api_key(apiKey);
  if (!user) return { payload: "Unauthorized", status: 401 };
  
  // Check if the recipe exists
  const recipe = await find_recipe_by_id(id);
  if (!recipe) return { payload: "Not Found", status: 404 };

  // Check if the user is the author of the recipe
  if (recipe.userId !== user.id)
    return { payload: "Forbidden", status: 403 };

  // Update the recipe
  const updatedRecipe = await update_recipe_by_id(id, updateData);
  if (!updatedRecipe)
    return { payload: "Internal Server Error", status: 500 };

  return { payload: updatedRecipe, status: 200 };
}


/**
 * Deletes a recipe by its ID.
 * @summary Delete a specific recipe by ID.
 * @param id - The UUID of the recipe.
 * @param apiKey - The API key for authentication.
 * @returns A response object confirming deletion if successful,
 *          or an error response.
 */
export async function deleteRecipe(
  id: string,
  apiKey: string
): Promise<RecipeControllerResponse | GenericAPIResponse> {
  // Check if the user is authorized
  const user: ServerUser | null = await get_user_by_api_key(apiKey);
  if (!user) return { payload: "Unauthorized", status: 401 };

  // Check if the recipe exists
  const recipe = await find_recipe_by_id(id);
  if (!recipe) return { payload: "Not Found", status: 404 };

  // Check if the user is the author
  if (recipe.userId !== user.id)
    return { payload: "Forbidden", status: 403 };
  
  // Delete the recipe
  const deletedRecipe = await delete_recipe_by_id(id);
  if (!deletedRecipe)
    return { payload: "Internal Server Error", status: 500 };

  return { payload: deletedRecipe, status: 200 };
}

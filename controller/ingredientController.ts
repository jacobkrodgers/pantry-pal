import { get_missing_ingredients } from "@/model/ingredientModel";
import { find_recipe_by_recipe_id } from "@/model/recipeModel";
import { get_user_by_api_key } from "@/model/userModel";
import { GenericAPIResponse } from "@/type/Generic";
import { RecipeControllerResponse } from "@/type/Recipe";
import { ServerUser } from "@/type/User";
import { Ingredient } from "@prisma/client";


/**
 * Finds the missing ingredients the user needs for an existing recipe
 * @summary Gets missing ingredients of specified recipe by ID
 * @param apiKey - The API key for authentication
 * @param recipeId - The UUID of the recipe
 * @param ingredientsOnHand - An object containing the ingredients the user already has
 * @returns A response object with a list of the missing ingredients for the specified recipe,
 *          or an error response
 */
export async function getMissingIngredients(
    apiKey: string, recipeId: string, ingredientsOnHand: Ingredient[]
):
    Promise<RecipeControllerResponse | GenericAPIResponse>
{
    // see if user is authorized
    const user: ServerUser | null = await get_user_by_api_key(apiKey);
    if (!user)
    {
        return { payload: "Unauthorized", status: 401 };
    }

    // check if recipe exists
    const neededRecipe = await find_recipe_by_recipe_id(recipeId);
    if (!neededRecipe)
    {
        return { payload: "Not Found", status: 404 };
    }

    // check if user owns recipe
    if (neededRecipe.userId !== user.id)
    {
        return { payload: "Forbidden", status: 403 };
    }

    // get the missing ingredients
    const missingIngredients = await get_missing_ingredients(recipeId, ingredientsOnHand);
    if (!missingIngredients)
    {
        return { payload: "Internal Server Error", status: 500 };
    }

    return { payload: missingIngredients, status: 200 };
}
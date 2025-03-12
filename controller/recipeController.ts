// controller/recipeController.ts
import { find_recipe_by_recipe_id,
         update_recipe_by_recipe_id,
         delete_recipe_by_recipe_id,
         find_recipes_by_user_id,
         create_recipe_by_user_id } 
    from "@/model/recipeModel";
import { NewRecipe, Recipe, RecipeControllerResponse } from "@/type/Recipe";
import { get_user_by_api_key } from "@/model/userModel";
import { ServerUser } from "@/type/User";
import { GenericAPIResponse } from "@/type/Generic";

/**
 * Retrieves a recipe by its ID.
 * @summary Get a specific recipe by ID.
 * @param apiKey - The API key for authentication.
 * @param id - The UUID of the recipe.
 * @returns A response object with the recipe if successful,
 *          or an error response.
 */
export async function getRecipeByRecipeId(apiKey: string, recipeId: string): 
    Promise<RecipeControllerResponse | GenericAPIResponse> 
{
    const user: ServerUser | null = await get_user_by_api_key(apiKey);
    if (!user)
    {
        return { payload: "Unauthorized", status: 401 };
    }

    const recipe = await find_recipe_by_recipe_id(recipeId);
    if (!recipe)
    {
        return { payload: "Not Found", status: 404 };
    }
    if (recipe.userId !== user.id)
    {
        return { payload: "Forbidden", status: 403 };
    }

    return { payload: recipe, status: 200 };
}

/**
 * Updates an existing recipe by its ID.
 * @summary Update a specific recipe by ID.
 * @param apiKey - The API key for authentication.
 * @param id - The UUID of the recipe.
 * @param recipeUpdateData - An object containing updated recipe details.
 * @returns A response object with the updated recipe if successful,
 *          or an error response.
 */
export async function updateRecipeByRecipeId(
    apiKey: string, recipeId: string, recipeUpdateData: NewRecipe
):
    Promise<RecipeControllerResponse | GenericAPIResponse> 
{
    // Check if the user is authorized.
    const user: ServerUser | null = await get_user_by_api_key(apiKey);
    if (!user)
    {
        return { payload: "Unauthorized", status: 401 };
    }

    // Check if the recipe exists.
    const originalRecipe = await find_recipe_by_recipe_id(recipeId);
    if (!originalRecipe)
    {
        return { payload: "Not Found", status: 404 };
    }

    // Check if the user is the author of the recipe.
    if (originalRecipe.userId !== user.id)
    {
        return { payload: "Forbidden", status: 403 };
    }

    // Update the recipe.
    const updatedRecipe = await update_recipe_by_recipe_id(recipeId, recipeUpdateData);
    if (!updatedRecipe)
    {
        return { payload: "Internal Server Error", status: 500 };
    }

    return { payload: updatedRecipe, status: 200 };
}

/**
 * Deletes a recipe by its ID.
 * @summary Delete a specific recipe by ID.
 * @param apiKey - The API key for authentication.
 * @param id - The UUID of the recipe.
 * @returns A response object confirming deletion if successful,
 *          or an error response.
 */
export async function deleteRecipeByRecipeId(apiKey: string, recipeId: string):
    Promise<RecipeControllerResponse | GenericAPIResponse> 
{
    // Check if the user is authorized.
    const user: ServerUser | null = await get_user_by_api_key(apiKey);
    if (!user)
    {
        return { payload: "Unauthorized", status: 401 };
    }

    // Check if the recipe exists.
    const recipe = await find_recipe_by_recipe_id(recipeId);
    if (!recipe)
    {
        return { payload: "Not Found", status: 404 };
    }

    // Check if the user is the author.
    if (recipe.userId !== user.id)
    {
        return { payload: "Forbidden", status: 403 };
    }

    // Delete the recipe.
    const deletedRecipe = await delete_recipe_by_recipe_id(recipeId);
    if (!deletedRecipe)
    {
        return { payload: "Internal Server Error", status: 500 };
    }
    return { payload: "Recipe deleted successfully", status: 200 };
}
/**
 * Gets a list of all recipes the user has permission to view based on their API key.
 * @param apiKey - The user's API Key.
 * @returns response - A response object containing a list of recipes as the payload.
 * @returns response - A response containing an HTTP status code and error message.
 */
export async function getRecipesByApiKey(apiKey: string): 
    Promise<RecipeControllerResponse | GenericAPIResponse>
{
    // Verify that the user exists in the database
    const user: ServerUser | null = await get_user_by_api_key(apiKey);
    if(!user) return {payload: "Unauthorized", status: 401};

    // Get recipe list
    const recipes: Recipe[] | null = await find_recipes_by_user_id(user.id);

    // Check if any recipes were found
    if(!recipes) return {payload: "Recipes not found", status: 404};

    return {payload: recipes, status: 200}
}

/**
 * Creates a new recipe.
 * @summary Creates a new recipe using a Recipe object provided by the user.
 * @param apiKey - The user's API key.
 * @param recipe - A recipe object that the user would like to add.
 * @returns A promise resolving to the created recipe, or null.
 * @returns A response containing an HTTP status code and error message.
 */
export async function createRecipeByApiKey(apiKey: string, recipe: NewRecipe): 
    Promise<RecipeControllerResponse> 
{
    // Get user associated with API Key
    const user: ServerUser | null = await get_user_by_api_key(apiKey);
    if(!user) return {payload: "Unauthorized", status: 401};

    // Attempt to create new recipe
    const newRecipe: Recipe | null = await create_recipe_by_user_id(user.id, recipe);
    if (!newRecipe) return {payload: "Internal Server Error", status: 500};

    return {payload: newRecipe, status: 200}
}

/**
 * Retrieves the ingredients of a recipe by its ID.
 * @summary Get the ingredients of a specific recipe by ID.
 * @param apiKey - The API key for authentication.
 * @param recipeId - The UUID of the recipe.
 * @returns A response object with the ingredients if successful,
 *          or an error response.
 */
export async function getRecipeIngredientsByRecipeId(apiKey: string, recipeId: string): 
    Promise<RecipeControllerResponse | GenericAPIResponse> 
{
    const user: ServerUser | null = await get_user_by_api_key(apiKey);
    if (!user)
    {
        return { payload: "Unauthorized", status: 401 };
    }

    const recipe = await find_recipe_by_recipe_id(recipeId);
    if (!recipe)
    {
        return { payload: "Not Found", status: 404 };
    }
    if (recipe.userId !== user.id)
    {
        return { payload: "Forbidden", status: 403 };
    }

    return { payload: recipe.ingredients, status: 200 };
}

/**
 * Retrieves the missing ingredients of a recipe by its ID.
 * @summary Get the missing ingredients of a specific recipe by ID.
 * @param apiKey - The API key for authentication.
 * @param recipeId - The UUID of the recipe.
 * @returns A response object with the missing ingredients if successful,
 *          or an error response.
 */
export async function getMissingIngredientsByRecipeId(apiKey: string, recipeId: string):
    Promise<RecipeControllerResponse | GenericAPIResponse>
{
    const user: ServerUser | null = await get_user_by_api_key(apiKey);
    if(!user)
    {
        return { payload: "Unauthorized", status: 401 };
    }

    const recipe = await find_recipe_by_recipe_id(recipeId);
    if(!recipe)
    {
        return { payload: "Not Found", status: 404 };
    }

    if(recipe.userId !== user.id)
    {
        return { payload: "Forbidden", status: 403 };
    }

    // Get existing ingredients
    const existingIngredientsMap = new Map(
        recipe.ingredients.map(ing => [`${ing.name}-${ing.form}`, ing])
    );

    // Separate missing ingredients
    const missingIngredients = (recipe.ingredients || [])
        .filter(ing => !existingIngredientsMap.has(`${ing.name}-${ing.form}`));


    return { payload: missingIngredients, status: 200 };
}
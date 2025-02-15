// controller/recipeController.ts
import { prisma } from '@/prisma/dbClient';
import { Recipe } from '@/type/Recipe';
import { create_or_update_recipe_by_user_id } from '@/model/recipe_model';

/**
 * Retrieves a specific recipe by its UUID.
 * @summary Get a specific recipe by ID.
 * @param id - The UUID of the recipe to retrieve.
 * @param apiKey - The API key for authentication.
 * @returns A promise that resolves to the recipe if found, otherwise null.
 */
export async function getRecipeById(id: string, apiKey: string): Promise<Recipe | null> {
    // Retrieve the recipe by its UUID.
    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: {
            ingredients: true,
            dietCompatibility: true,
            user: true,
        },
    });

    return recipe;
}

/**
 * Updates a specific recipe by its UUID.
 * Non-editable fields such as the owner and dateAdded are preserved.
 * Note: API key verification is not implemented in this function.
 * @summary Update a specific recipe by ID.
 * @param id - The UUID of the recipe to update.
 * @param apiKey - The API key for authentication.
 * @param updateData - An object containing the updated recipe details.
 * @returns A promise that resolves to the updated recipe if successful, otherwise null.
 */
export async function updateRecipe(
    id: string,
    apiKey: string,
    updateData: any
): Promise<Recipe | null> {
    // Retrieve the existing recipe.
    const existingRecipe = await prisma.recipe.findUnique({
        where: { id },
    });

    if (!existingRecipe) {
        return null;
    }

    // Use the existing recipe's userId for the update.
    const updatedRecipe = await create_or_update_recipe_by_user_id(
        existingRecipe.userId,
        updateData.name,
        updateData.ingredients,
        updateData.instructions,
        updateData.prepTime,
        updateData.cookTime,
        existingRecipe.dateAdded,       // Preserve original dateAdded
        updateData.dietCompatibility,
        id,                             // Specify recipeId for update.
        new Date()                      // Set dateUpdated to current date.
    );

    return updatedRecipe;
}

/**
 * Deletes a specific recipe by its UUID.
 * Note: API key verification is not implemented in this function.
 * @summary Delete a specific recipe by ID.
 * @param id - The UUID of the recipe to delete.
 * @param apiKey - The API key for authentication.
 * @returns A promise that resolves to the deleted recipe if successful, otherwise null.
 */
export async function deleteRecipe(
    id: string,
    apiKey: string
): Promise<Recipe | null> {
    // Retrieve the recipe to verify it exists.
    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: { user: true },
    });

    if (!recipe) {
        return null;
    }

    // Delete the recipe.
    const deletedRecipe = await prisma.recipe.delete({
        where: { id },
        include: {
            ingredients: true,
            dietCompatibility: true,
            user: true,
        },
    });

    return deletedRecipe;
}

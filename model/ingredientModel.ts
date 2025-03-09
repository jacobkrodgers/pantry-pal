import { prisma } from "@/prisma/dbClient"
import { Ingredient } from "@prisma/client";


/**
 * Finds the missing ingredients of a recipe given its ID and a list of ingredients
 * The function assumes the recipe already exists and separates the ingredients from the 
 * missing ingredients.
 * 
 * @param recipeId - the UUID of the recipe we are pulling ingredients from
 * @param ingredientsOnHand an object containing the ingredients the user has already
 * @returns the missing ingredients object or null
 */
export async function get_missing_ingredients(
    recipeId: string, ingredientsOnHand: Ingredient[]
): Promise<Ingredient[] | null> {
    try
    {
        // Get existing recipe
        const existingRecipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            include: { ingredients: true }
        });
        if (!existingRecipe) return null;

        // Get existing ingredients that match provided names and forms
        const existingIngredients = await prisma.ingredient.findMany({
            where: {
                OR: ingredientsOnHand.map(ing => ({
                    name: ing.name,
                    form: ing.form
                })) || []
            }
        });

        // Get existing ingredient identifiers
        const existingIngredientsMap = new Map(
            existingIngredients.map(ing => [`${ing.name}-${ing.form}`, ing])
        );

        // Separate missing ingredients
        const missingIngredients = (ingredientsOnHand || [])
            .filter(ing => !existingIngredientsMap.has(`${ing.name}-${ing.form}`));

        return missingIngredients;
    }
    catch
    {
        return null;
    }
}
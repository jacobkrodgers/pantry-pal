// model/recipe_model.ts
import { prisma } from "@/prisma/dbClient";
import { NewRecipe, Recipe } from "@/type/Recipe";

/**
 * Retrieves recipes created by a specific user.
 * @param user - The user object.
 * @returns A promise resolving to an array of recipes or null.
 */
export async function find_recipes_by_user_id(userId: string): 
    Promise<Recipe[] | null> 
{
  const recipes = await prisma.recipe.findMany({
    where: { userId },
    include: {
      ingredients: true,
      Diet: true,
    },
  });
  return recipes;
}

/**
 * Creates a new recipe.
 * @summary Accepts a user ID and a NewRecipe object and attempts to generate
 *          a new recipe. Individual users may not have multiple recipes with
 *          the same name. Note: There is currently a bug preventing diets from
 *          being added to the database.
 * @param userId - The ID of the user creating the recipe.
 * @param recipe - An object representing a new recipe to be added.
 * @returns A promise resolving to the newly created recipe or null.
 */
export async function create_recipe_by_user_id(userId: string, recipe: NewRecipe): 
    Promise<Recipe | null> 
{
    // Ensure dietCompatibility exists and contains valid diet names
    const validDiets = (recipe.Diet ?? [])
        .map(diet => diet.name)
        .filter(name => typeof name === "string" && name.trim() !== "");

    // Fetch existing ingredients that match provided names
    const existingIngredients = await prisma.ingredient.findMany({
        where: { name: { in: recipe.ingredients.map(ing => ing.name) } }
    });

    // Fetch existing diet compatibility categories
    const existingDiets = await prisma.diet.findMany({
        where: { name: { in: validDiets } }
    });

    // Extract names of existing items to avoid duplication
    const existingIngredientNames = new Set(existingIngredients.map(ing => ing.name));
    const existingDietNames = new Set(existingDiets.map(diet => diet.name));

    // Separate new ingredients and diets (only create those that don't exist)
    const newIngredients = recipe.ingredients
        .filter(ing => ing.name && !existingIngredientNames.has(ing.name));

    const newDiets = validDiets
        .filter(name => !existingDietNames.has(name))
        .map(name => ({ name })); // Format correctly for Prisma

    try
    {
        const newRecipe = await prisma.recipe.create({
            data: {
                name: recipe.name,
                instructions: recipe.instructions,
                prepTime: recipe.prepTime,
                cookTime: recipe.cookTime,
                userId,

                // Connect existing ingredients & create new ones
                ingredients: {
                    connect: existingIngredients.map(ing => ({ id: ing.id })),
                    create: newIngredients.map(ing => ({
                        name: ing.name,
                        quantityUnit: ing.quantityUnit,
                        quantity: ing.quantity,
                        form: ing.form
                    }))
                },

                // Connect existing diets & create new ones
                Diet: {
                    connect: existingDiets.map(diet => ({ id: diet.id })),
                    create: newDiets
                },
            },
            include: {
                ingredients: true,
                Diet: true,
                user: true,
            },
        });

        return newRecipe;
    }
    catch
    {
        return null;
    }
}

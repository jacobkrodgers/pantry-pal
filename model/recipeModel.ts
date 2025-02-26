import { prisma } from "@/prisma/dbClient";
import { NewRecipe, Recipe } from "@/type/Recipe";

/**
 * Retrieves a recipe by its ID.
 * @param id - The UUID of the recipe.
 * @returns A recipe object or null.
 */
export async function find_recipe_by_recipe_id(id: string): 
    Promise<Recipe | null>
{
    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: {
            ingredients: true,
            Diet: true
        },
    });

    return recipe;
}

/**
 * Updates an existing recipe by its ID.
 * This function assumes the recipe exists and updates only the provided
 * fields. Non-editable fields (e.g., dateAdded) are preserved.
 * It performs a nested update on ingredients so that their fields are
 * updated rather than simply reconnected.
 *
 * @param recipeId - The UUID of the recipe to update.
 * @param recipeUpdateData - An object containing updated recipe details.
 * @returns The updated recipe object or null.
 */
export async function update_recipe_by_recipe_id(
    recipeId: string, recipeUpdateData: NewRecipe
): Promise<Recipe | null> {
    try
    {
        // Fetch the existing recipe
        const existingRecipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            include: { ingredients: true, Diet: true }
        });
        if (!existingRecipe) return null;
        
        // Fetch existing ingredients that match provided names and forms
        const existingIngredients = await prisma.ingredient.findMany({
            where: {
                OR: recipeUpdateData.ingredients?.map(ing => ({
                    name: ing.name,
                    form: ing.form
                })) || []
            }
        });
        
        // Fetch existing diets
        const validDiets = (recipeUpdateData.Diet ?? [])
            .map(diet => diet?.name)
            .filter(name => typeof name === "string" && name.trim() !== "");
        
        const existingDiets = await prisma.diet.findMany({
            where: { name: { in: validDiets } }
        });
        
        // Extract existing ingredient identifiers
        const existingIngredientMap = new Map(
            existingIngredients.map(ing => [`${ing.name}-${ing.form}`, ing])
        );
        
        // Separate new ingredients and diets
        const newIngredients = (recipeUpdateData.ingredients || [])
            .filter(ing => !existingIngredientMap.has(`${ing.name}-${ing.form}`));
        
        const newDiets = validDiets
            .filter(name => !existingDiets.some(diet => diet.name === name))
            .map(name => ({ name }));
        
        // Update the recipe
        const updatedRecipeData = await prisma.recipe.update({
            where: { id: recipeId },
            data: {
                name: recipeUpdateData.name ?? existingRecipe.name,
                instructions: recipeUpdateData.instructions ?? existingRecipe.instructions,
                prepTime: recipeUpdateData.prepTime ?? existingRecipe.prepTime,
                cookTime: recipeUpdateData.cookTime ?? existingRecipe.cookTime,
                ingredients: {
                    set: [],
                    connect: existingIngredients.map(ing => ({ id: ing.id })),
                    create: newIngredients.map(ing => ({
                        name: ing.name,
                        quantityUnit: ing.quantityUnit,
                        quantity: ing.quantity,
                        form: ing.form
                    })),
                    update: recipeUpdateData.ingredients
                        ?.map(ing => {
                            const existingIngredient = existingIngredientMap.get(`${ing.name}-${ing.form}`);
                            return existingIngredient
                                ? {
                                    where: { id: existingIngredient.id },
                                    data: {
                                        quantity: ing.quantity,
                                        quantityUnit: ing.quantityUnit,
                                        form: ing.form
                                    }
                                }
                                : null;
                        })
                        .filter(update => update !== null)
                },
                Diet: {
                    connect: existingDiets.map(diet => ({ id: diet.id })),
                    create: newDiets
                }
            },
            include: {
                ingredients: true,
                Diet: true
            }
        });

        return updatedRecipeData;
    }
    catch 
    {
        return null;
    }
}

/**
 * Deletes a recipe by its ID.
 * @param id - The UUID of the recipe to delete.
 * @returns A promise resolving to the deleted raw recipe if successful,
 *          otherwise null.
 */
export async function delete_recipe_by_recipe_id(id: string): 
    Promise<Recipe | null> 
{
    try
    {
        const deletedRecipe = await prisma.recipe.delete({
        where: { id },
        include: {
            ingredients: true,
            Diet: true,
        },
    });
        return deletedRecipe;
    }
    catch
    {
        return null;
    }
}

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
    }
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
                Diet: true
            },
        });

        return newRecipe;
    }
    catch(e)
    {
        console.log(e)
        return null;
    }
}
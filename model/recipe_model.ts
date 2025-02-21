import { prisma } from "@/prisma/dbClient";
import { Recipe, Diet } from "@/type/Recipe";
import { Ingredient, User } from "@prisma/client";

/**
 * Retrieves recipes created by a specific user.
 * @param user - The user object from Prisma.
 * @returns A promise resolving to an array of recipes or null.
 */
export async function find_recipe_by_user(
  user: User
): Promise<Recipe[] | null> {
  const recipes = await prisma.recipe.findMany({
    where: { userId: user.id },
    include: {
      ingredients: true,
      dietCompatibility: true,
      user: true,
    },
  });
  return recipes.map((recipe) => ({
    ...recipe,
    authorUsername: recipe.user.username,
  }));
}

/**
 * Retrieves recipes based on ingredient, diet restriction, and date.
 * @param ingredient - An ingredient object to match.
 * @param dietCompatibility - A diet object to match.
 * @param dateAdded - A date to filter recipes added on or after.
 * @returns A promise resolving to an array of recipes or null.
 */
export async function find_recipe_by_restrictions(
  ingredient: Ingredient,
  dietCompatibility: Diet,
  dateAdded: Date
): Promise<Recipe[] | null> {
  const recipes = await prisma.recipe.findMany({
    where: {
      ingredients: { some: { id: ingredient.id } },
      dietCompatibility: { some: { id: dietCompatibility.id } },
      dateAdded: { gte: dateAdded },
    },
    include: {
      ingredients: true,
      dietCompatibility: true,
      user: true,
    },
  });
  return recipes.map((recipe) => ({
    ...recipe,
    authorUsername: recipe.user.username,
  }));
}

/**
 * Retrieves a recipe by its ID.
 * @param id - The UUID of the recipe.
 * @returns A promise resolving to the recipe if found, otherwise null.
 */
export async function find_recipe_by_id(id: string): Promise<Recipe | null> {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: true,
      dietCompatibility: true,
      user: true,
    },
  });
  if (!recipe) return null;
  return {
    ...recipe,
    authorUsername: recipe.user.username,
  };
}

/**
 * Updates an existing recipe by its ID.
 * This function assumes the recipe exists and updates only the provided
 * fields. Non-editable fields (e.g. dateAdded) are preserved.
 * It performs a nested update on ingredients so that their fields are
 * updated rather than simply reconnected.
 *
 * @param recipeId - The UUID of the recipe to update.
 * @param updateData - An object containing updated recipe details.
 * @returns A promise resolving to the updated recipe if successful,
 *          otherwise null.
 */
export async function update_recipe_by_id(
  recipeId: string,
  updateData: {
    name: string;
    ingredients: Ingredient[];
    instructions: string;
    prepTime: string;
    cookTime: string;
    dietCompatibility: (Diet | string)[];
  }
): Promise<Recipe | null> {
  // Ensure the recipe exists.
  const existingRecipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });
  if (!existingRecipe) return null;

  const updatedRecipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      name: updateData.name,
      instructions: updateData.instructions,
      prepTime: updateData.prepTime,
      cookTime: updateData.cookTime,
      ingredients: {
        // Nested update for each ingredient
        update: updateData.ingredients.map((ing) => ({
          where: { id: ing.id },
          data: {
            name: ing.name,
            quantityUnit: ing.quantityUnit,
            quantity: ing.quantity,
            form: ing.form,
          },
        })),
      },
      dietCompatibility: {
        // Replace the current diet compatibility associations.
        set: updateData.dietCompatibility.map((diet) =>
          typeof diet === "string" ? { id: diet } : { id: diet.id }
        ),
      },
    },
    include: {
      ingredients: true,
      dietCompatibility: true,
      user: true,
    },
  });
  return {
    ...updatedRecipe,
    authorUsername: updatedRecipe.user.username,
  };
}

/**
 * Creates a new recipe.
 * This function is meant to be used in a separate POST endpoint (e.g.,
 * /api/recipes). It creates a new recipe and associates it with the given user.
 * @param userId - The ID of the user creating the recipe.
 * @param createData - An object containing the recipe details.
 * @returns A promise resolving to the newly created recipe or null if creation fails.
 */
export async function create_recipe(
  userId: string,
  createData: {
    name: string;
    ingredients: Ingredient[];
    instructions: string;
    prepTime: string;
    cookTime: string;
    dateAdded: Date;
    dietCompatibility: (Diet | string)[];
  }
): Promise<Recipe | null> {
  try {
    const newRecipe = await prisma.recipe.create({
      data: {
        name: createData.name,
        ingredients: {
          // Use create to make new ingredients if they don’t exist
          create: createData.ingredients.map((ing) => ({
            name: ing.name,
            quantityUnit: ing.quantityUnit,
            quantity: ing.quantity,
            form: ing.form,
          })),
        },
        instructions: createData.instructions,
        prepTime: createData.prepTime,
        cookTime: createData.cookTime,
        dateAdded: createData.dateAdded,
        user: { connect: { id: userId } },
        dietCompatibility: {
          connect: createData.dietCompatibility.map((diet) =>
            typeof diet === "string" ? { id: diet } : { id: diet.id }
          ),
        },
      },
      include: {
        ingredients: true,
        dietCompatibility: true,
        user: true,
      },
    });
    return {
      ...newRecipe,
      authorUsername: newRecipe.user.username,
    };
  } catch (error) {
    console.error("Failed to create recipe:", error);
    return null;
  }
}

/**
 * Deletes a recipe by its ID.
 * @param id - The UUID of the recipe to delete.
 * @returns A promise resolving to the deleted recipe if successful,
 *          otherwise null.
 */
export async function delete_recipe_by_id(id: string): Promise<Recipe | null> {
  const existingRecipe = await prisma.recipe.findUnique({ where: { id } });
  if (!existingRecipe) return null;

  const deletedRecipe = await prisma.recipe.delete({
    where: { id },
    include: {
      ingredients: true,
      dietCompatibility: true,
      user: true,
    },
  });
  return {
    ...deletedRecipe,
    authorUsername: deletedRecipe.user.username,
  };
}

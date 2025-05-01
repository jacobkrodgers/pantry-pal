import { Prisma } from "@prisma/client";
import { prisma } from "@/prisma/dbClient";
import { DisplayRecipe, Ingredient, NewRecipe, Recipe, RecipeFilterCheckboxes } from "@/type/Recipe";
import unitConversion from "@/utils/dicts/unitConversion";

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
            dietTags: true,
        },
    });

    return recipe;
}

/**
 * Retrieves a recipe by username and recipe name.
 * @param userId - The ID of the recipe's author.
 * @param name - The name of the recipe.
 * @returns A recipe object or null.
 */
export async function find_recipe_by_recipe_name(userId: string, name: string): Promise<DisplayRecipe | null>
{
    const recipe = await prisma.recipe.findUnique({
        where: {
            name_userId: {
                userId, name
            }
        },
        include: {
            ingredients: true,
            dietTags: true,
            user: {
                select: {
                    username: true
                }
            }
        }
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
            include: { ingredients: true, dietTags: true }
        });
        if (!existingRecipe) return null;
        
        // Fetch existing ingredients that match provided names and forms
        const existingIngredients = await prisma.ingredient.findMany({
            where: {
                OR: recipeUpdateData.ingredients?.map(ing => ({
                    name: ing.name.toLowerCase(),
                    form: ing.form.toLowerCase()
                })) || []
            }
        });
        
        // Extract existing ingredient identifiers
        const existingIngredientMap = new Map(
            existingIngredients.map(ing => [`${ing.name.toLowerCase()}-${ing.form.toLowerCase()}`, ing])
        );
        
        // Separate new ingredients and diets
        const newIngredients = (recipeUpdateData.ingredients || [])
            .filter(ing => !existingIngredientMap.has(`${ing.name.toLowerCase()}-${ing.form.toLowerCase()}`));

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
                        name: ing.name.toLowerCase(),
                        quantityUnit: ing.quantityUnit.toLowerCase(),
                        quantity: ing.quantity,
                        form: ing.form.toLowerCase()
                    })),
                    update: recipeUpdateData.ingredients
                        ?.map(ing => {
                            const existingIngredient = existingIngredientMap.get(`${ing.name.toLowerCase()}-${ing.form.toLowerCase()}`);
                            return existingIngredient
                                ? {
                                    where: { id: existingIngredient.id },
                                    data: {
                                        quantity: ing.quantity,
                                        quantityUnit: ing.quantityUnit.toLowerCase(),
                                        form: ing.form.toLowerCase()
                                    }
                                }
                                : null;
                        })
                        .filter(update => update !== null)
                },
                
                // Connect existing diets & create new ones
                dietTags: {
                    connectOrCreate: recipeUpdateData.dietTags.map(tag => ({
                        where: { name: tag },
                        create: { name: tag }
                    })),

                    // Removes any ingredients that are no longer in the recipe
                    disconnect: existingRecipe.dietTags
                        .filter(tag => !recipeUpdateData.dietTags.includes(tag.name))
                        .map(tag => ({ name: tag.name }))
                },
                isPublic: recipeUpdateData.isPublic ?? existingRecipe.isPublic
            },
            include: {
                ingredients: true,
                dietTags: true
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
            dietTags: true,
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
      dietTags: true,
    }
  });
  return recipes;
}

/**
 * Creates a new recipe.
 * @summary Accepts a user ID and a NewRecipe object and attempts to generate
 *          a new recipe. Individual users may not have multiple recipes with
 *          the same name.
 * @param userId - The ID of the user creating the recipe.
 * @param recipe - An object representing a new recipe to be added.
 * @returns A promise resolving to the newly created recipe or null.
 */
export async function create_recipe_by_user_id(userId: string, recipe: NewRecipe): 
    Promise<Recipe | null>
{
    try
    {
        const newRecipe = await prisma.recipe.create({
            data: {
                name: recipe.name.replaceAll('%20', ''),
                instructions: recipe.instructions,
                prepTime: recipe.prepTime,
                cookTime: recipe.cookTime,
                userId,

                ingredients: {
                    create: recipe.ingredients.map(ing => ({
                        name: ing.name.toLowerCase(),
                        quantityUnit: ing.quantityUnit.toLowerCase(),
                        quantity: ing.quantity,
                        form: ing.form.toLowerCase()
                    }))
                },

                dietTags: {
                    connectOrCreate: recipe.dietTags.map(tag => ({
                        where: { name: tag },
                        create: { name: tag }
                    }))
                },

                isPublic: recipe.isPublic ?? false
            },
            include: {
                ingredients: true,
                dietTags: true
            }
        });

        return newRecipe;
    }
    catch (e)
    {
        return null;
    }
}

export async function delete_ingredient_by_id(id: string):
    Promise<Ingredient | null>
{
    try
    {
        const deletedIngredient = await prisma.ingredient.delete({
            where: {
                id
            }
        })

        return deletedIngredient;
    }
    catch
    {
        return null;
    }
}

export async function get_recipes(
    searchString: string,
    userId: string,
    page: number,
    resultsPerPage: number,
    sortBy: string,
    sortAsc: boolean,
    checkboxes: RecipeFilterCheckboxes,
    filterByIngredients: boolean
  ): Promise<{ recipes: DisplayRecipe[]; count: number }> 
{
    const direction = sortAsc ? "asc" : "desc";
    let orderBy: Prisma.RecipeOrderByWithRelationInput = {};
  
    if (sortBy === "name" && searchString !== "") 
    {
        orderBy = {
            _relevance: {
            fields: [Prisma.RecipeOrderByRelevanceFieldEnum.name],
            search: searchString,
            sort: direction,
            },
        };
    } 
    else if (sortBy === "name") 
    {
        orderBy = { name: direction };
    } 
    else if (sortBy === "date") 
    {
        orderBy = { dateUpdated: direction };
    }
  
    const pantry = await prisma.pantry.findUnique({
        where: { userId },
        include: { ingredients: true },
    });
  
    if (!pantry) return { recipes: [], count: 0 };
  
    const pantryIngredients = pantry.ingredients;
    const recipeIdSet = new Set<string>();
  
    if (
      filterByIngredients &&
      (checkboxes.haveIngredients ||
        checkboxes.lowOnIngredients ||
        checkboxes.dontHaveIngredients ||
        checkboxes.mightHaveIngredients)
    ) 
    {
        const allRecipes = await prisma.recipe.findMany(
        {
            where: { userId },
            include: { ingredients: true },
        });
  
        for (const recipe of allRecipes) 
        {
            const ingredients = recipe.ingredients;
            let add = true;
            if (!(checkboxes.haveIngredients))
            {
                if (matchesHaveOneIngredient(ingredients, pantryIngredients)) add = false;
            }
            if (!(checkboxes.lowOnIngredients))
            {
                if (matchesLowOnOneIngredient(ingredients, pantryIngredients)) add = false;
            }
            if (!(checkboxes.dontHaveIngredients))
            {
                if (matchesDontHaveOneIngredient(ingredients, pantryIngredients)) add = false;
            }
            if (!(checkboxes.mightHaveIngredients))
            {
                if (matchesMightHaveOneIngredient(ingredients, pantryIngredients)) add = false;
            }

            if (checkboxes.haveIngredients)
            {
                if (!checkboxes.dontHaveIngredients)
                {
                    if (matchesDontHaveOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
                if (!checkboxes.lowOnIngredients)
                {
                    if (matchesLowOnOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
                if (!checkboxes.mightHaveIngredients)
                {
                    if (matchesMightHaveOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
            }
            if (checkboxes.dontHaveIngredients)
            {
                if (!checkboxes.haveIngredients)
                {
                    if (matchesHaveOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
                if (!checkboxes.lowOnIngredients)
                {
                    if (matchesLowOnOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
                if (!checkboxes.mightHaveIngredients)
                {
                    if (matchesMightHaveOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
            }
            if (checkboxes.lowOnIngredients)
            {
                if (!checkboxes.haveIngredients)
                {
                    if (matchesHaveOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
                if (!checkboxes.dontHaveIngredients)
                {
                    if (matchesDontHaveOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
                if (!checkboxes.mightHaveIngredients)
                {
                    if (matchesMightHaveOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
            }
            if (checkboxes.mightHaveIngredients)
            {
                if (!checkboxes.haveIngredients)
                {
                    if (matchesHaveOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
                if (!checkboxes.dontHaveIngredients)
                {
                    if (matchesDontHaveOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
                if (!checkboxes.lowOnIngredients)
                {
                    if (matchesLowOnOneIngredient(ingredients, pantryIngredients))
                    {
                        add = false;
                    }
                }
            }

            if (add) recipeIdSet.add(recipe.id)

        }
    }
  
    const whereClause: Prisma.RecipeWhereInput = {
      userId,
      name: { contains: searchString },
    };
  
    if (
      filterByIngredients &&
      (checkboxes.haveIngredients ||
        checkboxes.lowOnIngredients ||
        checkboxes.dontHaveIngredients ||
        checkboxes.mightHaveIngredients)
    ) 
    {
        whereClause.id = { in: Array.from(recipeIdSet) };
    }
  
    const filteredRecipes = await prisma.recipe.findMany({
        where: whereClause,
        include: {
            ingredients: true,
            dietTags: true,
            user: {
                select: { username: true },
            },
        },
        orderBy,
        skip: (page - 1) * resultsPerPage,
        take: resultsPerPage,
    });
  
    const count = await prisma.recipe.count({ where: whereClause });
  
    return { recipes: filteredRecipes, count };
}
  

function matchesHaveOneIngredient(
    recipeIngredients: Ingredient[],
    pantryIngredients: Ingredient[]
): boolean 
{
    for (const ingredient of recipeIngredients) 
    {
        const match = pantryIngredients.find((pi) => 
        {
            const sameName = pi.name === ingredient.name;
            const sameUnit = pi.quantityUnit === ingredient.quantityUnit;
            const canConvert =
                pi.quantityUnit in unitConversion &&
                ingredient.quantityUnit in unitConversion;

            return sameName && (sameUnit || canConvert);
        });

        if (!match) continue;

        let matchQuantity = match.quantity;
        let ingredientQuantity = ingredient.quantity;

        if (match.quantityUnit !== ingredient.quantityUnit) 
        {
            const fromUnit = match.quantityUnit;
            const toUnit = ingredient.quantityUnit;

            if (
                fromUnit in unitConversion &&
                toUnit in unitConversion
            ) 
            {
                matchQuantity *= unitConversion[fromUnit];
                ingredientQuantity *= unitConversion[toUnit];
            } 
            else 
            {
                continue;
            }
        }

        if (matchQuantity >= ingredientQuantity) return true;
    }

    return false;
}

export function matchesLowOnOneIngredient(
    recipeIngredients: Ingredient[],
    pantryIngredients: Ingredient[]
  ): boolean 
  {
      for (const ingredient of recipeIngredients) 
      {
          const match = pantryIngredients.find((pi) => 
          {
              const sameName = pi.name === ingredient.name;
              const sameUnit = pi.quantityUnit === ingredient.quantityUnit;
              const canConvert =
                  pi.quantityUnit in unitConversion &&
                  ingredient.quantityUnit in unitConversion;
  
              return sameName && (sameUnit || canConvert);
          });
  
          if (!match) continue;
  
          let matchQuantity = match.quantity;
          let ingredientQuantity = ingredient.quantity;
  
          if (match.quantityUnit !== ingredient.quantityUnit) 
          {
              const fromUnit = match.quantityUnit;
              const toUnit = ingredient.quantityUnit;
  
              if (fromUnit in unitConversion && toUnit in unitConversion)
              {
                  matchQuantity *= unitConversion[fromUnit];
                  ingredientQuantity *= unitConversion[toUnit];
              } 
              else 
              {
                  continue;
              }
          }
  
          if (matchQuantity < ingredientQuantity) 
          {
              return true;
          }
      }
  
      return false;
}

export function matchesDontHaveOneIngredient(
    recipeIngredients: Ingredient[],
    pantryIngredients: Ingredient[]
): boolean 
{
    for (const ingredient of recipeIngredients) 
    {
        const match = pantryIngredients.find((pi) => pi.name === ingredient.name);

        if (!match) return true;
        else 
        {
            const fromUnit = match.quantityUnit;
            const toUnit = ingredient.quantityUnit;

            const canConvert =
                fromUnit in unitConversion &&
                toUnit in unitConversion;

            if (canConvert) 
            {
                const matchQuantity = match.quantity * unitConversion[fromUnit];
                const ingredientQuantity = ingredient.quantity * unitConversion[toUnit];

                if (matchQuantity < ingredientQuantity) return true;
            } 
        }
    }

    return false;
}


export function matchesMightHaveOneIngredient( 
    recipeIngredients: Ingredient[],
    pantryIngredients: Ingredient[]
): boolean 
{
    for (const ingredient of recipeIngredients) 
    {
        const match = pantryIngredients.find((pi) => pi.name === ingredient.name);
  
        if (!match) continue;
  
        if (match.quantityUnit === ingredient.quantityUnit) 
        {
            continue;
        } 
        else 
        {
            const fromUnit = match.quantityUnit;
            const toUnit = ingredient.quantityUnit;
    
            const canConvert =
                fromUnit in unitConversion &&
                toUnit in unitConversion;
    
            if (!canConvert)
            {
                return true;
            }
        }
    }
  
    return false;
}

export async function get_recipe_by_name(userId: string, name: string):
    Promise<Recipe | null>
{
    try
    {
        const recipe = await prisma.recipe.findUnique({
            where: {
                name_userId: {
                    name,
                    userId
                }
            },
            include: {
                ingredients: true,
                dietTags: true
            }
        })

        return recipe;
    }
    catch
    {
        return null;
    }
}
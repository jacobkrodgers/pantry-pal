import { prisma } from "@/prisma/dbClient";
import { User, Recipe, Diet } from "@/type/Recipe";
import { Ingredient } from "@prisma/client";




export async function find_recipe_by_user(user: User):
    Promise<Recipe[] | null>
{
    const recipes = await prisma.recipe.findMany({
        where: {
            userId: user.id,
        },
        include: {
            ingredients: true,
            dietCompatibility: true,
            user: true,
        },
    });

    return recipes;
}

export async function find_recipe_by_restrictions(ingredients: Ingredient, dietCompatibility: Diet, dateAdded: Date):
    Promise<Recipe[] | null>
{
    const recipes = await prisma.recipe.findMany({
        where: {
            ingredients: {
                some: {
                    id: ingredients.id,
                },
            },
            dietCompatibility: {
                some: {
                    id: dietCompatibility.id,
                },
            },
            dateAdded: {
                gte: dateAdded,
            },
        },
        include: {
            ingredients: true,
            dietCompatibility: true,
            user: true
        }
    });

    return recipes;
}

export async function delete_recipe_by_user_id(userId: string):
    Promise<Recipe | null>
{
    try
    {
        const deletedRecipe = await prisma.recipe.delete({
            where: {
                userId: userId,
            },
            include: {
                ingredients: true,
                dietCompatibility: true,
                user: true,
            },
        });

        return deletedRecipe;
    }
    catch
    {
        return null;
    }
}

export async function create_or_update_recipe_by_user_id(
    userId: string,
    name: string,
    ingredients: Ingredient[],
    instructions: string,
    prepTime: string,
    cookTime: string,
    dateAdded: Date,
    dietCompatibility: Diet[],
    recipeId: string | null,
    dateUpdated: Date
):Promise<Recipe | null>
{
    if(recipeId) {
        const updatedRecipe = await prisma.recipe.update({
            where: {
                id: recipeId
            },
            data: {
                name,
                ingredients: {
                    connect: ingredients.map(ingredient => ({id: ingredient.id})),
                },
                instructions,
                prepTime,
                cookTime,
                dateUpdated,
                dietCompatibility: {
                    connect: dietCompatibility.map(diet => ({id: diet.id})),
                },
            },
            include: {
                ingredients: true,
                dietCompatibility: true,
                user: true,
            },
        });
        return updatedRecipe;
    } else {
        const newRecipe = await prisma.recipe.create({
            data: {
                name,
                ingredients: {
                    connect: ingredients.map(ingredient => ({ id: ingredient.id })),
                },
                instructions,
                prepTime,
                cookTime,
                dateAdded,
                user: {
                    connect: { id: userId },
                },
                dietCompatibility: {
                    connect: dietCompatibility.map(diet => ({ id: diet.id })),
                },
            },
            include: {
                ingredients: true,
                dietCompatibility: true,
                user: true,
            },
        });
        return newRecipe;
    }
}
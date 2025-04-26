"use server"

import { getPantryBySession } from "@/controller/pantryController";
import { deleteRecipeByRecipeId, deleteRecipeBySession, getRecipeByRecipeName } from "@/controller/recipeController";
import { getClientUserBySessionId } from "@/controller/userController";
import { Pantry } from "@/type/Pantry";
import { DisplayRecipe, Ingredient, Recipe } from "@/type/Recipe";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getRecipe(username: string, recipeName: string):
    Promise<DisplayRecipe | null>
{
    // Attempt to get session ID from user cookies
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    // Convert URL encoding to recipe name string
    const parsedRecipeName = recipeName.replaceAll("%20", " ",)

    // Attempt to get recipe from the database
    const recipe = await getRecipeByRecipeName(sessionId, username, parsedRecipeName);

    return recipe.payload ?? null;
}

export async function getPantry():
    Promise<Ingredient[] | []>
{
    // Attempt to get session ID from user cookies
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    const pantry = await getPantryBySession(sessionId);

    if (!pantry.payload)
    {
        return [];
    }

    return pantry.payload.ingredients;
}

export async function deleteRecipe(recipeId: string)
{
    // Attempt to get session ID from user cookies
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    const user = await getClientUserBySessionId(sessionId);

    if (!user.payload)
    {
        redirect('/login');
    }

    const deletedRecipeResponse = await deleteRecipeBySession(sessionId, recipeId);

    if (deletedRecipeResponse.status === 200)
    {
        redirect(`/${user.payload.username}/recipes`)
    }

    return {status: 500}
}
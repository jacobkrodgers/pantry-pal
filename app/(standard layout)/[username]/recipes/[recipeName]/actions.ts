"use server"

import { getRecipeByRecipeName } from "@/controller/recipeController";
import { Recipe } from "@/type/Recipe";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getRecipe(username: string, recipeName: string):
    Promise<Recipe | null>
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
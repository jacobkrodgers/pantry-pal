'use server'

import { createRecipeBySessionId, getRecipeByName } from "@/controller/recipeController";
import { ActionResponse } from "@/type/Generic";
import { DisplayRecipe, NewRecipe } from "@/type/Recipe";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { Recipe } from "recipemd";

export async function checkExistingRecipe(recipeName: string):
    Promise<Boolean>
{
    // Attempt to get session ID from user cookies
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    const recipe = await getRecipeByName(sessionId, recipeName);
    
    if (recipe.status === 200)
        return true;

    return false;
}

export async function createRecipe(newRecipe: NewRecipe):
    Promise<ActionResponse<DisplayRecipe>>
{
    // Attempt to get session ID from user cookies
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    const recipe = await createRecipeBySessionId(sessionId, newRecipe);
    
    if (recipe.status != 201 || !recipe.payload)
    {
        return {status: 500, message: "Something went wrong!"}
    }

    redirect(`/user/recipes/${recipe.payload.name}`.replaceAll(' ', '%20'))
}
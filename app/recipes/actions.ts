'use server'

import { getPantryBySession } from "@/controller/pantryController";
import { getRecipesBySession } from "@/controller/recipeController";
import { ActionResponse } from "@/type/Generic";
import { Pantry } from "@/type/Pantry";
import { DisplayRecipe, Recipe, RecipeFilterCheckboxes } from "@/type/Recipe";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getRecipes(
    searchString: string, 
    page: number, 
    resultsPerPage: number, 
    sortBy: string, 
    sortAsc: boolean, 
    filterByIngredients: boolean, 
    checkboxes: RecipeFilterCheckboxes
):
    Promise<ActionResponse<{recipes: DisplayRecipe[], count: number}>>
{
    // Attempt to get session ID from user cookies
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    const recipesResponse = await getRecipesBySession(
        sessionId, searchString, page, 
        resultsPerPage, sortBy, sortAsc, 
        filterByIngredients, checkboxes)

    return recipesResponse;
}

export async function getPantry():
    Promise<ActionResponse<Pantry>>
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    const pantry = await getPantryBySession(sessionId);
    return {status: 201, message: "Success", payload: pantry.payload};
}
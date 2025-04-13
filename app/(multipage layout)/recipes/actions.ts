'use server'

import { getPublicUserBySessionId } from "@/controller/userController";
import { get_recipes, get_recipes_by_username } from "@/model/recipeModel";
import { Recipe } from "@/type/Recipe";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getRecipes(searchString: string, page: number, recipesPerPage: number):
    Promise<Recipe[] | null>
{
    // // Attempt to get session ID from user cookies
    // const cookieStore = await cookies();
    // const sessionId = cookieStore.get('session')?.value;
        
    const sessionId = "6b42cebb-be98-43f4-af55-25d31ba65392";
    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        console.log("!sessionId")
        redirect(`/login`);
    }

    const user = await getPublicUserBySessionId(sessionId);
    if (!user)
    {
        console.log("!user")
        redirect('/login')
    }

    const recipes = await get_recipes(searchString, user.payload?.username!, page, recipesPerPage)
    return recipes

    return null;

}
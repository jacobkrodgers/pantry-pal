import { Typography } from "@mui/material";
import { redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { getRecipeByRecipeName } from "@/controller/recipeController";
import RecipePage from "@/Components/Recipe/RecipePage";

export default async function Page(
    {params}: {params: Promise<{ username: string, recipeName: string }>}
)
{
    // Parse username and recipeId from path parameters
    const { username, recipeName } = await params;

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

    // If a recipe was not found or the user was not authorized
    if (!recipe.payload)
    {
        return <Typography>{recipe.message}</Typography>
    }

    return (
        <RecipePage recipe={recipe.payload} />
    );
}
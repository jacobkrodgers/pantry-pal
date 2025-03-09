import { NextResponse } from "next/server";
import { uuidSchema } from "@/validation/uuidValidation";
import { getRecipeByRecipeId } from "@/controller/recipeController";

/**
 * GET /api/recipes/[id]/ingredients - Retrieves a list of ingredients for a specific recipe.
 * @summary Gets the ingredients of the specified recipe, provided the user has permission.
 * @param req - The request object.
 * @param params - The route parameters, including the recipe ID.
 * @returns JSON with a list of ingredients or an error message.
 */
export async function GET(
    req: Request, 
    { params }: { params: { id: string } }
): Promise<NextResponse>
{
    // Get API key from request header, trim it, and validate.
    let apiKey = req.headers.get("X-API-Key");
    if (!apiKey) 
    {
        return NextResponse.json("Not Authorized", { status: 401 });
    }
    apiKey = apiKey.trim();

    // Validate the API key.
    const { error: apiKeyError } = uuidSchema.validate({ uuid: apiKey });
    if (apiKeyError) 
    {
        return NextResponse.json("Bad Request - Invalid API Key", { status: 400 });
    }

    // Validate the recipe ID from the URL path.
    const recipeId = params.id;
    const { error: recipeIdError } = uuidSchema.validate({ uuid: recipeId });
    if (recipeIdError)
    {
        return NextResponse.json("Bad Request - Invalid Recipe ID", { status: 400 });
    }

    // Retrieve the recipe (and validate user ownership) via the controller.
    const recipeResponse = await getRecipeByRecipeId(apiKey, recipeId);

    // If an error occurred (unauthorized, forbidden, not found), return it.
    if (recipeResponse.status !== 200)
    {
        return NextResponse.json(recipeResponse.payload, { status: recipeResponse.status });
    }

    // Return the ingredients of the recipe.
    const recipe = recipeResponse.payload as { ingredients: unknown };
    return NextResponse.json(recipe.ingredients, { status: 200 });
}

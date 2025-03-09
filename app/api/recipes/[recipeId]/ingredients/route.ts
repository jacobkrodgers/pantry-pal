import { NextResponse } from "next/server";
import { uuidSchema } from "@/validation/uuidValidation";
import { getRecipeByRecipeId } from "@/controller/recipeController";

/**
 * GET /api/recipes/{id}/ingredients - Retrieves a list of ingredients for a specific recipe.
 * @summary Get the ingredients of a specific recipe by ID.
 * @param req - The request object.
 * @param params - An object with the recipe id.
 * @returns JSON with the list of ingredients or an error message.
 */
export async function GET(req: Request, { params }: { params: Promise<{ recipeId: string }> }):
    Promise<NextResponse>
{
    let recipeId: string;

    // Get ID from path parameters.
    try 
    {
        ({ recipeId } = await params);
        if (!recipeId) throw new Error();
    }
    catch 
    {
        return NextResponse.json("Not Found", { status: 404 });
    }

    // Validate that the recipe ID is a UUID.
    const { error: recipeIdValidationError } = uuidSchema.validate({ uuid: recipeId });
    if (recipeIdValidationError)
    {
        return NextResponse.json("Bad Request - Invalid Recipe ID", { status: 400 });
    }

    // Get API key from request header, trim it, and validate.
    let apiKey = req.headers.get("X-API-Key");
    if (!apiKey)
    {
        return NextResponse.json("Not Authorized", { status: 401 });
    }
    apiKey = apiKey.trim();

    // Validate the API key.
    const { error: apiKeyValidationError } = uuidSchema.validate({ uuid: apiKey });
    if (apiKeyValidationError)
    {
        return NextResponse.json("Bad Request - Invalid API Key", { status: 400 });
    }

    // Get the recipe by ID and return its ingredients.
    const recipeResponse = await getRecipeByRecipeId(apiKey, recipeId);
    if (recipeResponse.status !== 200)
    {
        return NextResponse.json(recipeResponse.payload, { status: recipeResponse.status });
    }

    // At this point, recipeResponse.payload should be a recipe object.
    const recipe = recipeResponse.payload as { ingredients: unknown };
    return NextResponse.json(recipe.ingredients, { status: 200 });
}

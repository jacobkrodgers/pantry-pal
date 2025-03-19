import { NextResponse } from "next/server";
import { uuidSchema } from "@/validation/uuidValidation";
import { getMissingIngredientsByRecipeId } from "@/controller/recipeController";
import { Ingredient } from "@prisma/client";

/**
 * POST /api/recipes/{id}/ingredients/missing - Retrieves a list of missing ingredients for a specific recipe.
 * @summary Get the missing ingredients of a specific recipe by ID.
 * @param req - The request object.
 * @param params - An object with the recipe id.
 * @returns JSON with the list of ingredients or an error message.
 */
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ recipeId: string }>}
): Promise<NextResponse>
{
    let recipeId: string;

    // get ID from params
    try
    {
        ({ recipeId } = await params);
        if (!recipeId) throw new Error();
    }
    catch
    {
        return NextResponse.json( "Not Found", { status: 404 });
    }

    // validate recipeId is a UUID
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

    let ingredientsOnHand: Ingredient[] | undefined = undefined;
    try
    {
        const body = await req.json();
        if(!body.ingredientsOnHand) throw new Error();
        if (!(Array.isArray(body.ingredientsOnHand))) throw new Error();
        ingredientsOnHand = body.ingredientsOnHand;
    }
    catch
    {
        return NextResponse.json("Bad Request - Invalid Body", { status: 400 });
    }

    if(!Array.isArray(ingredientsOnHand))
        return NextResponse.json("Bad Request - Invalid Body Format", { status: 400 });

    // Get the ingredients by recipe ID and return them.
    const missingIngredientsResponse = await getMissingIngredientsByRecipeId(apiKey, recipeId, ingredientsOnHand);
    return NextResponse.json(missingIngredientsResponse.payload, { status: missingIngredientsResponse.status });
}

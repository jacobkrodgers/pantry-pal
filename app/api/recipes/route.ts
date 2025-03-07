import { NextResponse } from "next/server";
import { uuidSchema } from "@/validation/uuidValidation";
import { newRecipeSchema } from "@/validation/recipeValidation";
import { createRecipeByApiKey, getRecipesByApiKey } from "@/controller/recipeController";
import { NewRecipe } from "@/type/Recipe";
import { parseRecipeMarkdownFile } from "@/utils/recipes/markdownUtility";

/**
 * GET /api/recipes/ - Retrieves a list of recipes that the user has permission to view.
 * @summary Gets a list of recipes the user has permission to view based on their API
 *          key (currently, only recipes that the user owns).
 * @param req - The request object.
 * @returns JSON with a list of recipes or an error message.
 */
export async function GET(req: Request): Promise<NextResponse>
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

    // Get the recipes associated with the user.
    const recipeResponse = await getRecipesByApiKey(apiKey);
    return NextResponse.json(recipeResponse.payload, { status: recipeResponse.status });
}

/**
 * GET /api/recipes/ - Retrieves a list of recipes that the user has permission to view.
 * @summary Gets a list of recipes the user has permission to view based on their API
 *          key (currently, only recipes that the user owns).
 * @param req - The request object.
 * @returns JSON with a list of recipes or an error message.
 */
export async function POST(req: Request): Promise<NextResponse>
{
    let recipe: NewRecipe;
    
    const formData = await req.formData();
    const files = formData.get('recipe') as File
    console.log(files)
    parseRecipeMarkdownFile(files)
    // console.log(content)
    


    // Check for malformed request body (syntax errors)
    try
    {
        recipe = await req.json();
    }
    catch
    {
        return NextResponse.json("Bad Request - Malformed Request Body", {status: 400});
    }

    // Validate the recipe object
    const { error: recipeValidationError } = newRecipeSchema.validate(recipe);
    if (recipeValidationError) 
    {
        return NextResponse.json("Bad Request - Invalid Recipe", { status: 400 });
    }

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

    // Attempt to create new recipe
    const recipeResponse = await createRecipeByApiKey(apiKey, recipe);

    return NextResponse.json(recipeResponse.payload, {status: recipeResponse.status})
}
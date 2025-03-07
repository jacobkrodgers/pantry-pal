import { NextResponse } from "next/server";
import { uuidSchema } from "@/validation/uuidValidation";
import { newRecipeSchema } from "@/validation/recipeValidation";
import { createRecipeByApiKey, getRecipesByApiKey } from "@/controller/recipeController";
import { extractTextFromFile, parseRecipeMarkdownText } from "@/utils/recipes/markdownUtility";
import { NewRecipe } from "@/type/Recipe";

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
    let recipe: NewRecipe | null;

    // Determine whether the recipe data should be pulled from json or a file.
    const contentType = req.headers.get("Content-Type");

    if (!contentType)
    {
        return NextResponse.json("Bad Request - Malformed Request Body", {status: 400});
    }
    else if(contentType === "application/json")
    {
        // Pull Recipe from json
        try
        {
            // Should be in the form of a NewRecipe
            recipe = await req.json();
        }
        catch
        {
            return NextResponse.json("Bad Request - Malformed JSON Request", {status: 400});
        }
    }
    else 
    {
        let recipeText: string | null;

        if (contentType.startsWith("multipart/form-data"))
        {
            // Pull Recipe from markdown or text file
            try
            {
                const formData = await req.formData();
                const file = formData.get('recipe') as File; 
                recipeText = await extractTextFromFile(file);
                if (!recipeText) throw new Error();
            }
            catch
            {
                return NextResponse.json("Bad Request - File Missing or Improperly Formatted", {status: 400});
            }
        }
        else if (contentType === "text/plain" || contentType === "text/markdown")
        {
            // Pull the recipe (in markdown format) from a raw string
            try
            {   
                recipeText = await req.text();
                if (!recipeText) throw new Error();
            }
            catch
            {
                return NextResponse.json("Bad Request - Missing Request Text", {status: 400});
            }
        }
        else
        {
            return NextResponse.json("Bad Request - Invalid Content-Type", {status: 400});
        }

        // Parse the recipe into a NewRecipe object
        recipe = await parseRecipeMarkdownText(recipeText);
    }

    // Recipe not provided or improperly parsed
    if (!recipe) return NextResponse.json("Bad Request - Malformed Request Body", {status: 400});

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
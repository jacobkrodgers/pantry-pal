// app/api/recipes/[id]/route.ts
import { NextResponse } from "next/server";
import { getRecipeByRecipeId, 
         updateRecipeByRecipeId, 
         deleteRecipeByRecipeId } 
    from "@/controller/recipeController";
import { uuidSchema } from "@/validation/uuidValidation";
import { newRecipeSchema } from "@/validation/recipeValidation";

/**
 * GET /api/recipes/{id} - Retrieves a recipe.
 * @summary Get a specific recipe by ID.
 * @param req - The request object.
 * @param params - An object with the recipe id.
 * @returns JSON with recipe data or an error message.
 */
export async function GET(req: Request, {params}: {params: Promise<{recipeId: string}>}):
    Promise<NextResponse> 
{
    let recipeId: string;

    // Get ID from path parameters.
    try 
    {
        ({recipeId} = await params);
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

    // Get the recipe by ID and return it.
    const recipeResponse = await getRecipeByRecipeId(apiKey, recipeId);
    return NextResponse.json(recipeResponse.payload, { status: recipeResponse.status });
}

/**
 * PUT /api/recipes/{id} - Updates a recipe.
 * @summary Update a specific recipe by ID.
 * @param req - The request object with updated JSON body.
 * @param params - An object with the recipe id.
 * @returns JSON with the updated recipe or an error message.
 */
export async function PUT(req: Request, {params}: {params: Promise<{recipeId: string}>}):
    Promise<NextResponse> 
{
    let recipeId;

    // Extract the recipe Id from the path
    try
    {
        recipeId = (await params).recipeId;
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

    // Retrieve, trim, and validate the API key.
    let apiKey = req.headers.get("X-API-Key");
    if (!apiKey) 
    {
        return NextResponse.json("Not Authorized", { status: 401 });
    }
    apiKey = apiKey.trim();

    const { error: apiKeyValidationError } = uuidSchema.validate({ uuid: apiKey });
    if (apiKeyValidationError) 
    {
        return NextResponse.json("Bad Request - Invalid API Key", { status: 400 });
    }

    // Validate the JSON body against the recipe update schema.
    let recipeUpdateData;
    try
    {
       recipeUpdateData = await req.json();
    }
    catch
    {
        return NextResponse.json("Bad Request - Malformed Request Body", {status: 400});
    }

    const { error: recipeValidationError } = newRecipeSchema.validate(recipeUpdateData);
    if (recipeValidationError) 
    {
        return NextResponse.json("Bad Request - Invalid Recipe", { status: 400 });
    }

    // Update the recipe.
    const updatedRecipeResponse = await updateRecipeByRecipeId(apiKey, recipeId, recipeUpdateData);

    return NextResponse.json(updatedRecipeResponse, { status: updatedRecipeResponse.status });
}

/**
 * DELETE /api/recipes/{id} - Deletes a recipe.
 * @summary Delete a specific recipe by ID.
 * @param req - The request object.
 * @param params - An object with the recipe id.
 * @returns JSON confirming deletion or an error message.
 */
export async function DELETE(req: Request, {params}: {params: Promise<{recipeId: string}>}): 
    Promise<NextResponse> 
{
    let recipeId;

    // Extract the recipe Id from the path
    try
    {
        ({recipeId} = await params);
        if (!recipeId) throw new Error();
    }
    catch
    {
        return NextResponse.json("Not Found", { status: 404 });
    }
    
    // Validate the recipe Id
    const {error: recipeIdValidationError} = uuidSchema.validate({ uuid: recipeId });
    if (recipeIdValidationError) 
    {
        return NextResponse.json("Bad Request - Invalid Recipe ID", { status: 400 });
    }

    // Retrieve, trim, and validate the API key.
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
    
    // Delete the recipe.
    const deletedRecipeResponse = await deleteRecipeByRecipeId(apiKey, recipeId);

    return NextResponse.json(
        deletedRecipeResponse.payload, { status: deletedRecipeResponse.status }
    );
}

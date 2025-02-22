// app/api/recipes/[id]/route.ts
import { NextResponse } from "next/server";
import { getRecipeById, updateRecipe, deleteRecipe } from "@/controller/recipeController";
import { uuidSchema } from "@/validation/uuidValidation";
import { recipeUpdateSchema } from "@/validation/recipeValidation";

/**
 * GET /api/recipes/{id} - Retrieves a recipe.
 * @summary Get a specific recipe by ID.
 * @param req - The request object.
 * @param params - An object with the recipe id.
 * @returns JSON with recipe data or an error message.
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    let id: string;

    // Get ID from path parameters.
    try 
    {
        const resolvedParams = await params;
        id = resolvedParams.id;
        if (!id) throw new Error("ID not provided");
    } 
    catch 
    {
        return NextResponse.json("Not Found", { status: 404 });
    }

    // Validate that the recipe ID is a UUID.
    const { error: idError } = uuidSchema.validate({ uuid: id });
    if (idError) 
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
    const { error: apiKeyError } = uuidSchema.validate({ uuid: apiKey });
    if (apiKeyError) 
    {
        return NextResponse.json("Bad Request - Invalid API Key", { status: 400 });
    }

    // Get the recipe by ID and return it.
    const recipeResponse = await getRecipeById(id, apiKey);
    return NextResponse.json(recipeResponse.payload, { status: recipeResponse.status });
}

/**
 * PUT /api/recipes/{id} - Updates a recipe.
 * @summary Update a specific recipe by ID.
 * @param req - The request object with updated JSON body.
 * @param params - An object with the recipe id.
 * @returns JSON with the updated recipe or an error message.
 */
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try 
    {
        // Extract and validate the recipe ID.
        const { id } = await params;
        const { error: idError } = uuidSchema.validate({ uuid: id });
        if (idError) 
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
        const { error: apiKeyError } = uuidSchema.validate({ uuid: apiKey });
        if (apiKeyError) 
        {
            return NextResponse.json("Bad Request - Invalid API Key", { status: 400 });
        }

        // Validate the JSON body against the recipe update schema.
        const body = await req.json();
        const { error: bodyError } = recipeUpdateSchema.validate(body);
        if (bodyError) 
        {
            return NextResponse.json({ code: 400, message: bodyError.message }, { status: 400 });
        }

        // Update the recipe.
        const updatedRecipe = await updateRecipe(id, apiKey, body);

        // Return a response based on the update result.
        if (!updatedRecipe) 
        {
            return NextResponse.json({ code: 404, message: "Recipe not found" }, { status: 404 });
        }
        return NextResponse.json(updatedRecipe, { status: 200 });
    } 
    catch (err: unknown) 
    {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

/**
 * DELETE /api/recipes/{id} - Deletes a recipe.
 * @summary Delete a specific recipe by ID.
 * @param req - The request object.
 * @param params - An object with the recipe id.
 * @returns JSON confirming deletion or an error message.
 */
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try 
    {
        // Extract and validate the recipe ID.
        const { id } = await params;
        const { error: idError } = uuidSchema.validate({ uuid: id });
        if (idError) 
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
        const { error: apiKeyError } = uuidSchema.validate({ uuid: apiKey });
        if (apiKeyError) 
        {
            return NextResponse.json("Bad Request - Invalid API Key", { status: 400 });
        }
        
        // Delete the recipe.
        const deletionResult = await deleteRecipe(id, apiKey);

        // Return a response based on the deletion result.
        if (!deletionResult) 
        {
            return NextResponse.json({ code: 404, message: "Recipe not found" }, { status: 404 });
        }
        return NextResponse.json({ code: 200, message: "Recipe deleted successfully" }, { status: 200 });
    } 
    catch (err: unknown) 
    {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

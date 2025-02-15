// app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRecipeById, updateRecipe, deleteRecipe } from '@/controller/recipeController';
import { recipeIdSchema, apiKeySchema, recipeUpdateSchema } from '@/validation/recipeValidation';

/**
 * Route handler for GET requests made to /api/recipes/{id}.
 * Retrieves a specific recipe by its UUID.
 * Inputs are sanitized and validated before fetching the recipe data.
 * @summary Get a specific recipe by ID.
 * @param req - The request object.
 * @param params - An object containing the recipe id extracted from the URL.
 * @returns A response object with the recipe payload if found, or an error message with an appropriate HTTP status code.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    // Check if the recipe ID is valid
    try {
        // Extract the recipe ID from the URL
        const { id } = params;
        await recipeIdSchema.validateAsync({ id });

        // Extract the API key from the request headers
        const apiKey = req.headers.get('X-API-Key');
        await apiKeySchema.validateAsync({ apiKey });

        // Fetch the recipe by its ID
        const recipe = await getRecipeById(id, apiKey!);
        // Return an error message if the recipe is not found
        if (!recipe) {
            return NextResponse.json({ code: 404, message: "Recipe not found" }, { status: 404 });
        }
        // Return the recipe if found
        return NextResponse.json(recipe, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ code: error.isJoi ? 400 : 500, message: error.message || "Server error" }, { status: error.isJoi ? 400 : 500 });
    }
}

/**
 * Route handler for PUT requests made to /api/recipes/{id}.
 * Updates the details of a specific recipe by its UUID.
 * Validates both the recipe ID and the provided update payload,
 * ensuring that non-editable fields remain unchanged.
 * @summary Update a specific recipe by ID.
 * @param req - The request object containing updated recipe details in JSON.
 * @param params - An object containing the recipe id extracted from the URL.
 * @returns A response object with the updated recipe payload if successful, or an error message with an appropriate HTTP status code.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Extract the recipe ID from the URL
        const { id } = params;
        await recipeIdSchema.validateAsync({ id });

        // Extract the API key from the request headers
        const apiKey = req.headers.get('X-API-Key');
        await apiKeySchema.validateAsync({ apiKey });

        // Extract the updated recipe details from the request body
        const body = await req.json();
        await recipeUpdateSchema.validateAsync(body);

        // Update the recipe with the new details
        const updatedRecipe = await updateRecipe(id, apiKey!, body);

        // Return an error message if the recipe is not found
        if (!updatedRecipe) {
            return NextResponse.json({ code: 404, message: "Recipe not found" }, { status: 404 });
        }
        return NextResponse.json(updatedRecipe, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ code: error.isJoi ? 400 : 500, message: error.message || "Server error" }, { status: error.isJoi ? 400 : 500 });
    }
}

/**
 * Route handler for DELETE requests made to /api/recipes/{id}.
 * Deletes a specific recipe by its UUID.
 * Validates the recipe ID and API key before performing the deletion.
 * @summary Delete a specific recipe by ID.
 * @param req - The request object.
 * @param params - An object containing the recipe id extracted from the URL.
 * @returns A response object confirming deletion if successful, or an error message with an appropriate HTTP status code.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Extract the recipe ID from the URL
        const { id } = params;
        await recipeIdSchema.validateAsync({ id });

        // Extract the API key from the request headers
        const apiKey = req.headers.get('X-API-Key');
        await apiKeySchema.validateAsync({ apiKey });

        // Delete the recipe by its ID
        const deletionResult = await deleteRecipe(id, apiKey!);

        // Return an error message if the recipe is not found
        if (!deletionResult) {
            return NextResponse.json({ code: 404, message: "Recipe not found" }, { status: 404 });
        }
        // Return a success message if the recipe is deleted
        return NextResponse.json({ code: 200, message: "Recipe deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ code: error.isJoi ? 400 : 500, message: error.message || "Server error" }, { status: error.isJoi ? 400 : 500 });
    }
}

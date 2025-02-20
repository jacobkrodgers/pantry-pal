// app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "@/controller/recipeController";
import {
  recipeIdSchema,
  apiKeySchema,
  recipeUpdateSchema,
} from "@/validation/recipeValidation";

/**
 * GET /api/recipes/{id} - Retrieves a recipe.
 * @summary Get a specific recipe by ID.
 * @param req - The request object.
 * @param params - An object with the recipe id.
 * @returns JSON with recipe data or an error message.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await recipeIdSchema.validateAsync({ id });

    const apiKey = req.headers.get("X-API-Key");
    await apiKeySchema.validateAsync({ apiKey });

    const recipe = await getRecipeById(id, apiKey!);
    if (!recipe) {
      return NextResponse.json(
        { code: 404, message: "Recipe not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(recipe, { status: 200 });
  } catch (err: unknown) {
    let code = 500;
    let message = "Server error";
    if (
      typeof err === "object" &&
      err !== null &&
      "isJoi" in err &&
      (err as { isJoi: boolean }).isJoi
    ) {
      code = 400;
      message = (err as unknown as Error).message;
    } else if (
      typeof err === "object" &&
      err !== null &&
      "message" in err
    ) {
      message = (err as unknown as Error).message;
    }
    return NextResponse.json({ code, message }, { status: code });
  }
}

/**
 * PUT /api/recipes/{id} - Updates a recipe.
 * @summary Update a specific recipe by ID.
 * @param req - The request object with updated JSON body.
 * @param params - An object with the recipe id.
 * @returns JSON with the updated recipe or an error message.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await recipeIdSchema.validateAsync({ id });

    const apiKey = req.headers.get("X-API-Key");
    await apiKeySchema.validateAsync({ apiKey });

    const body = await req.json();
    await recipeUpdateSchema.validateAsync(body);

    const updatedRecipe = await updateRecipe(id, apiKey!, body);
    if (!updatedRecipe) {
      return NextResponse.json(
        { code: 404, message: "Recipe not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch (err: unknown) {
    let code = 500;
    let message = "Server error";
    if (
      typeof err === "object" &&
      err !== null &&
      "isJoi" in err &&
      (err as { isJoi: boolean }).isJoi
    ) {
      code = 400;
      message = (err as unknown as Error).message;
    } else if (
      typeof err === "object" &&
      err !== null &&
      "message" in err
    ) {
      message = (err as unknown as Error).message;
    }
    return NextResponse.json({ code, message }, { status: code });
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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await recipeIdSchema.validateAsync({ id });

    const apiKey = req.headers.get("X-API-Key");
    await apiKeySchema.validateAsync({ apiKey });

    const deletionResult = await deleteRecipe(id, apiKey!);
    if (!deletionResult) {
      return NextResponse.json(
        { code: 404, message: "Recipe not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { code: 200, message: "Recipe deleted successfully" },
      { status: 200 }
    );
  } catch (err: unknown) {
    let code = 500;
    let message = "Server error";
    if (
      typeof err === "object" &&
      err !== null &&
      "isJoi" in err &&
      (err as { isJoi: boolean }).isJoi
    ) {
      code = 400;
      message = (err as unknown as Error).message;
    } else if (
      typeof err === "object" &&
      err !== null &&
      "message" in err
    ) {
      message = (err as Error).message;
    }
    return NextResponse.json({ code, message }, { status: code });
  }
}

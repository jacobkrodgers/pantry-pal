'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ingredientQuantityAndUnitSchema, ingredientSchema } from "@/validation/ingredientValidation";
import { addPantryIngredientBySession, addShoppingListIngredientBySession, getPantryBySession, getShoppingListBySession, updateIngredientById } from "@/controller/pantryController";
import { Ingredient, NewIngredient } from "@/type/Recipe";
import { ActionResponse } from "@/type/Generic";
import { Pantry } from "@/type/Pantry";
import { deleteIngredientById } from "@/controller/pantryController";

export async function addPantryItem(newIngredient: NewIngredient):
    Promise<ActionResponse<Ingredient>>
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    const { error: ingredientError } = ingredientSchema.validate(newIngredient)

    if (ingredientError) {
        console.error("Ingredient validation failed", ingredientError.details);
        return { status: 400, message: ingredientError.message };
    }

    const newPantryItem = await addPantryIngredientBySession(sessionId, newIngredient);

    if (newPantryItem.status != 201) return {status: 500, message: "Internal Server Error"};

    return {status: 201, message: "Success", payload: newPantryItem.payload};
}

export async function addShoppingListItem(newIngredient: NewIngredient):
    Promise<ActionResponse<Ingredient>>
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    const { error: ingredientError } = ingredientSchema.validate(newIngredient)

    if (ingredientError) return {status: 500, message: "Internal Server Error"};

    const newPantryItem = await addShoppingListIngredientBySession(sessionId, newIngredient)

    if (newPantryItem.status != 201) return {status: 500, message: "Internal Server Error"};

    return {status: 201, message: "Success", payload: newPantryItem.payload};
}

export async function getPantry():
    Promise<ActionResponse<Pantry>>
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    const pantry = await getPantryBySession(sessionId);
    return {status: 201, message: "Success", payload: pantry.payload};
}

export async function getShoppingList():
    Promise<ActionResponse<Pantry>>
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    const shoppingList = await getShoppingListBySession(sessionId);

    return {status: 201, message: "Success", payload: shoppingList.payload};
}

export async function deleteItemById(ingredientId: string):
    Promise<ActionResponse<Ingredient>>
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }

    const deletedPantryItemResponse = await deleteIngredientById(ingredientId)

    return deletedPantryItemResponse;
}

export async function updateItem(
    ingredientId: string, 
    ingredientQuantity: number, 
    ingredientUnit: string
):
    Promise<ActionResponse<Ingredient>>
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user isn't logged in, redirect
    if (!sessionId)
    {
        redirect(`/login`);
    }
    
    const {error: updateValidationError} = ingredientQuantityAndUnitSchema.validate({quantity: ingredientQuantity, unit: ingredientUnit});

    if (updateValidationError) 
        {
            return {message: "Internal Server Error", status: 500}
        }
    const updatedPantryItemResponse = await updateIngredientById(ingredientId, {quantity: ingredientQuantity, quantityUnit: ingredientUnit});

    return updatedPantryItemResponse;
}
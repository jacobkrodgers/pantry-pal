'use server'

import { ActionResponse } from "@/type/Generic";
import { Pantry } from "@/type/Pantry";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { addPantryIngredientBySession, addShoppingListIngredientBySession, getPantryBySession } from "@/controller/pantryController";
import { getShoppingListBySession } from "@/controller/pantryController";
import { Ingredient, NewIngredient } from "@/type/Recipe";
import { ingredientSchema } from "@/validation/ingredientValidation";

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
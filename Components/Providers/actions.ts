import { ActionResponse } from "@/type/Generic";
import { Pantry } from "@/type/Pantry";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPantryBySession } from "@/controller/pantryController";
import { getShoppingListBySession } from "@/controller/pantryController";

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
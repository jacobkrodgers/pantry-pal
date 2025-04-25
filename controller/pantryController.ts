import { get_public_user_by_session } from "@/model/userModel";
import {
    get_pantry_by_user_id,
    get_shopping_list_by_user_id,
    add_pantry_ingredient_by_user_id,
    add_shopping_list_ingredient_by_user_id,
    delete_pantry_ingredient_by_id,
    delete_shopping_list_ingredient_by_id,
    update_pantry_ingredient_by_id,
    update_shopping_list_ingredient_by_id,
    create_pantry_by_user_id,
    create_shopping_list_by_user_id,
} from "@/model/pantryModel";
import { Ingredient, NewIngredient } from "@/type/Recipe";
import { Pantry } from "@/type/Pantry";
import { ActionResponse } from "@/type/Generic";
import { delete_ingredient_by_id } from "@/model/recipeModel";

export async function getPantryBySession(sessionId: string): 
    Promise<ActionResponse<Pantry>> 
{
    const user = await get_public_user_by_session(sessionId);
    if (!user) return { message: "Unauthorized", status: 401 };

    let pantry = await get_pantry_by_user_id(user.id);
    if (!pantry)
    {
        pantry = await create_pantry_by_user_id(user.id);
    };

    if (!pantry) {
        return { message: "Unable to create pantry", status: 500 };
    }

    return { payload: pantry, status: 201 };
}

export async function getShoppingListBySession(sessionId: string): 
    Promise<ActionResponse<Pantry>> 
{
    const user = await get_public_user_by_session(sessionId);
    if (!user) return { message: "Unauthorized", status: 401 };

    let shoppingList = await get_shopping_list_by_user_id(user.id);
    if (!shoppingList)
    {
        shoppingList = await create_shopping_list_by_user_id(user.id);
    };

    if (!shoppingList) {
        return { message: "Unable to create shopping list", status: 500 };
    }
    return { payload: shoppingList, status: 201 };
}

export async function addPantryIngredientBySession(
    sessionId: string, 
    ingredient: NewIngredient
):
    Promise<ActionResponse<Ingredient>> 
{
    const user = await get_public_user_by_session(sessionId);
    if (!user) return { message: "Unauthorized", status: 401 };

    const added = await add_pantry_ingredient_by_user_id(user.id, ingredient);
    if (!added) return { message: "Unable to add ingredient", status: 500 };

    return { payload: added, status: 201 };

}

export async function addShoppingListIngredientBySession(sessionId: string, ingredient: NewIngredient): 
    Promise<ActionResponse<Ingredient>> 
{
    const user = await get_public_user_by_session(sessionId);
    if (!user) return { message: "Unauthorized", status: 401 };

    const added = await add_shopping_list_ingredient_by_user_id(user.id, ingredient);
    if (!added) return { message: "Unable to add ingredient", status: 500 };

    return { payload: added, status: 201 };
}

export async function deletePantryIngredientById(sessionId: string, ingredientId: string): 
    Promise<ActionResponse<string>> 
{
    const user = await get_public_user_by_session(sessionId);
    if (!user) return { message: "Unauthorized", status: 401 };

    const deleted = await delete_pantry_ingredient_by_id(ingredientId);
    if (!deleted) return { message: "Ingredient not found", status: 404 };

    return { payload: "Ingredient deleted", status: 200 };
}

export async function deleteShoppingListIngredientById(sessionId: string, ingredientId: string): 
    Promise<ActionResponse<string>> 
{
    const user = await get_public_user_by_session(sessionId);
    if (!user) return { message: "Unauthorized", status: 401 };

    const deleted = await delete_shopping_list_ingredient_by_id(ingredientId);
    if (!deleted) return { message: "Ingredient not found", status: 404 };

    return { payload: "Ingredient deleted", status: 200 };
}

export async function updateIngredientById(
    ingredientId: string, updatedData: 
    Partial<Ingredient>
):
    Promise<ActionResponse<Ingredient>> 
{

    const updated = await update_pantry_ingredient_by_id(ingredientId, updatedData);
    if (!updated) return { message: "Unable to update ingredient", status: 404 };

    return { payload: updated, status: 200 };
}

export async function updateShoppingListIngredientById(
    sessionId: string, 
    ingredientId: string, 
    updatedData: Partial<Ingredient>
): 
    Promise<ActionResponse<Ingredient>> 
{
    const user = await get_public_user_by_session(sessionId);
    if (!user) return { message: "Unauthorized", status: 401 };

    const updated = await update_shopping_list_ingredient_by_id(ingredientId, updatedData);
    if (!updated) return { message: "Unable to update ingredient", status: 404 };

    return { payload: updated, status: 200 };
}

export async function deleteIngredientById(ingredientId: string):
    Promise<ActionResponse<Ingredient>>
{
    const deletedIngredient = delete_ingredient_by_id(ingredientId);

    if (!deletedIngredient) return { message: "Internal Server Error", status: 500 };

    return {message: "Ingredient Deleted.", status: 200}
}
import { get_user_by_api_key } from "@/model/userModel";
import {
  get_pantry_by_user_id,
  get_shopping_list_by_user_id,
  add_pantry_ingredient_by_user_id,
  add_shopping_list_ingredient_by_user_id,
  delete_pantry_ingredient_by_id,
  delete_shopping_list_ingredient_by_id,
  update_pantry_ingredient_by_id,
  update_shopping_list_ingredient_by_id,
} from "@/model/pantryModel";
import { ServerUser } from "@/type/User";
import { Ingredient } from "@/type/Recipe";
import { Pantry } from "@/type/Pantry";
import { GenericAPIResponse, ActionResponse } from "@/type/Generic";

export async function getPantryByApiKey(apiKey: string): Promise<ActionResponse<Pantry>> {
  const user: ServerUser | null = await get_user_by_api_key(apiKey);
  if (!user) return { message: "Unauthorized", status: 401 };

  const pantry = await get_pantry_by_user_id(user.id);
  if (!pantry) return { message: "Pantry not found", status: 404 };

  return { payload: pantry, status: 200 };
}

export async function getShoppingCartByApiKey(apiKey: string): Promise<ActionResponse<Pantry>> {
  const user: ServerUser | null = await get_user_by_api_key(apiKey);
  if (!user) return { message: "Unauthorized", status: 401 };

  const list = await get_shopping_list_by_user_id(user.id);
  if (!list) return { message: "Shopping list not found", status: 404 };

  return { payload: list, status: 200 };
}

export async function addPantryIngredientByApiKey(apiKey: string, ingredient: Ingredient): Promise<ActionResponse<Ingredient>> {
  const user: ServerUser | null = await get_user_by_api_key(apiKey);
  if (!user) return { message: "Unauthorized", status: 401 };

  const added = await add_pantry_ingredient_by_user_id(user.id, ingredient);
  if (!added) return { message: "Unable to add ingredient", status: 500 };

  return { payload: added, status: 200 };
}

export async function addShoppingCartIngredientByApiKey(apiKey: string, ingredient: Ingredient): Promise<ActionResponse<Ingredient>> {
  const user: ServerUser | null = await get_user_by_api_key(apiKey);
  if (!user) return { message: "Unauthorized", status: 401 };

  const added = await add_shopping_list_ingredient_by_user_id(user.id, ingredient);
  if (!added) return { message: "Unable to add ingredient", status: 500 };

  return { payload: added, status: 200 };
}

export async function deletePantryIngredientById(apiKey: string, ingredientId: string): Promise<ActionResponse<string>> {
  const user: ServerUser | null = await get_user_by_api_key(apiKey);
  if (!user) return { message: "Unauthorized", status: 401 };

  const deleted = await delete_pantry_ingredient_by_id(ingredientId);
  if (!deleted) return { message: "Ingredient not found", status: 404 };

  return { payload: "Ingredient deleted", status: 200 };
}

export async function deleteShoppingCartIngredientById(apiKey: string, ingredientId: string): Promise<ActionResponse<string>> {
  const user: ServerUser | null = await get_user_by_api_key(apiKey);
  if (!user) return { message: "Unauthorized", status: 401 };

  const deleted = await delete_shopping_list_ingredient_by_id(ingredientId);
  if (!deleted) return { message: "Ingredient not found", status: 404 };

  return { payload: "Ingredient deleted", status: 200 };
}

export async function updatePantryIngredientById(apiKey: string, ingredientId: string, updatedData: Partial<Ingredient>): Promise<ActionResponse<Ingredient>> {
  const user: ServerUser | null = await get_user_by_api_key(apiKey);
  if (!user) return { message: "Unauthorized", status: 401 };

  const updated = await update_pantry_ingredient_by_id(ingredientId, updatedData);
  if (!updated) return { message: "Unable to update ingredient", status: 404 };

  return { payload: updated, status: 200 };
}

export async function updateShoppingCartIngredientById(apiKey: string, ingredientId: string, updatedData: Partial<Ingredient>): Promise<ActionResponse<Ingredient>> {
  const user: ServerUser | null = await get_user_by_api_key(apiKey);
  if (!user) return { message: "Unauthorized", status: 401 };

  const updated = await update_shopping_list_ingredient_by_id(ingredientId, updatedData);
  if (!updated) return { message: "Unable to update ingredient", status: 404 };

  return { payload: updated, status: 200 };
}
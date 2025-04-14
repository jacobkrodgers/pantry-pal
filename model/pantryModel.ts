import { prisma } from "@/prisma/dbClient";
import { Pantry } from "@/type/Pantry";
import { Ingredient } from "@/type/Recipe";

export async function get_pantry_by_user_id(userId: string): 
    Promise<Pantry | null>
{
    const pantry = await prisma.pantry.findUnique({
        where: { userId },
        include: {
            ingredients: true,
        },
    });
  
    if (!pantry) {
        return null;
    }
  
    return pantry;
}

export async function get_shopping_list_by_user_id(userId: string): 
    Promise<Pantry | null>
{
    const shoppingCart = await prisma.shoppingCart.findUnique({
        where: { userId },
        include: {
            ingredients: true,
        },
    });
  
    if (!shoppingCart) {
        return null;
    }
  
    return shoppingCart;
}

export async function add_pantry_ingredient_by_user_id(userId: string, ingredient: Ingredient):
    Promise<Ingredient | null>
{
    const pantry = await prisma.pantry.findUnique({
        where: { userId },
    });
  
    if (!pantry) {
        return null;
    }
  
    const pantryIngredient = await prisma.ingredient.create({
        data: {
            name: ingredient.name,
            quantity: ingredient.quantity,
            quantityUnit: ingredient.quantityUnit,
            form: ingredient.form,
            pantryId: pantry.id,
        },
    });
  
    return pantryIngredient;
}

export async function add_shopping_list_ingredient_by_user_id(userId: string, ingredient: Ingredient):
    Promise<Ingredient | null>
{
    const shoppingCart = await prisma.shoppingCart.findUnique({
        where: { userId },
    });
  
    if (!shoppingCart) {
        return null;
    }
  
    const shoppingCartIngredient = await prisma.ingredient.create({
        data: {
            name: ingredient.name,
            quantity: ingredient.quantity,
            quantityUnit: ingredient.quantityUnit,
            form: ingredient.form,
            pantryId: shoppingCart.id,
        },
    });
  
    return shoppingCartIngredient;
}

export async function delete_pantry_ingredient_by_id(ingredientId: string):
    Promise<Ingredient | null>
{
    const deletedIngredient = await prisma.ingredient.delete({
        where: { id: ingredientId },
    });
  
    return deletedIngredient;
}

export async function delete_shopping_list_ingredient_by_id(ingredientId: string) 
{
    const deletedIngredient = await prisma.shoppingCart.delete({
        where: { id: ingredientId },
    });
  
    return deletedIngredient;
}

export async function update_pantry_ingredient_by_id(ingredientId: string, updatedData: Partial<Ingredient>):
    Promise<Ingredient | null>
{
    const updatedIngredient = await prisma.ingredient.update({
        where: { id: ingredientId },
        data: {
            name: updatedData.name,
            quantity: updatedData.quantity,
            quantityUnit: updatedData.quantityUnit,
            form: updatedData.form,
        },
    });
  
    return updatedIngredient;
}

export async function update_shopping_list_ingredient_by_id(ingredientId: string, updatedData: Partial<Ingredient>):
    Promise<Ingredient | null>
{
    const updatedIngredient = await prisma.ingredient.update({
        where: { id: ingredientId },
        data: {
            name: updatedData.name,
            quantity: updatedData.quantity,
            quantityUnit: updatedData.quantityUnit,
            form: updatedData.form,
        },
    });
  
    return updatedIngredient;
}
  
import { prisma } from "@/prisma/dbClient";
import { Pantry } from "@/type/Pantry";
import { Ingredient, NewIngredient } from "@/type/Recipe";

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
    const shoppingList = await prisma.shoppingList.findUnique({
        where: { userId },
        include: {
            ingredients: true,
        },
    });
  
    if (!shoppingList) {
        return null;
    }
  
    return shoppingList;
}

export async function add_pantry_ingredient_by_user_id(userId: string, ingredient: NewIngredient):
    Promise<Ingredient | null>
{
    try
    {
        const pantry = await prisma.pantry.findUnique({
            where: { userId },
        });
      
        if (!pantry) {
            return null;
        }
      
        const pantryIngredient = await prisma.ingredient.create({
            data: {
                name: ingredient.name.toLowerCase(),
                quantity: ingredient.quantity,
                quantityUnit: ingredient.quantityUnit.toLowerCase(),
                form: ingredient.form.toLowerCase(),
                pantryId: pantry.id,
            },
        });
      
        return pantryIngredient;
    }
    catch
    {
        return null;
    }
    
}

export async function add_shopping_list_ingredient_by_user_id(userId: string, ingredient: NewIngredient):
    Promise<Ingredient | null>
{
    try
    {
        const shoppingList = await prisma.shoppingList.findUnique({
            where: { userId },
        });
      
        if (!shoppingList) {
            return null;
        }
      
        const shoppingListIngredient = await prisma.ingredient.create({
            data: {
                name: ingredient.name.toLowerCase(),
                quantity: ingredient.quantity,
                quantityUnit: ingredient.quantityUnit.toLowerCase(),
                form: ingredient.form.toLowerCase(),
                shoppingListId: shoppingList.id,
            },
        });
      
        return shoppingListIngredient;
    }
    catch
    {
        return null;
    }
    
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
    const deletedIngredient = await prisma.shoppingList.delete({
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

export async function create_pantry_by_user_id(userId: string): 
    Promise<Pantry | null> 
{
    const pantry = await prisma.pantry.create({
        data: { userId },
        include: {
            ingredients: true,
        },
    });

    return pantry;
}

export async function create_shopping_list_by_user_id(userId: string): 
    Promise<Pantry | null> 
{
    const shoppingList = await prisma.shoppingList.create({
        data: { userId },
        include: {
            ingredients: true,
        },
    });

    return shoppingList;
}
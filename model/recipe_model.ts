import { prisma } from "@/prisma/dbClient";
import { User, Recipe } from "@/type/Recipe";




export async function find_recipe_by_owner(owner: User):
    Promise<Recipe | null>
{
    const recipes = await prisma.recipe.findMany({
        where: {
            owner: owner,
        },
    });

    return recipes;
}
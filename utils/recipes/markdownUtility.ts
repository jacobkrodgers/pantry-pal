import { NewRecipe } from '@/type/Recipe';
import 'dotenv/config'
import { Ingredient, Recipe } from "recipemd";
class ExtendedIngredient extends Ingredient { form:string | undefined }

export async function parseRecipeMarkdownFile(recipeMarkdownFile: File): Promise<null>
{
    if (recipeMarkdownFile.size > Number(process.env.MAX_RECIPE_FILE_SIZE))
    {
        console.log("file too big");
    }

    const content = await recipeMarkdownFile.text();

    const recipe = Recipe.parse(content);
    if (!recipe.instructions) return null;

    let newRecipe: NewRecipe = {
        name: recipe.title, 
        ingredients: [], 
        instructions: recipe.instructions,
        Diet: recipe.tags
    };
    newRecipe.name = recipe.title;
    const ingredients = recipe.ingredients;
    
    for (const ingredient of ingredients)
    {
        const nameAndForm = ingredient.name.split("(");
        let form: string | undefined = undefined;

        if (nameAndForm.length > 1)
            form = nameAndForm[1].split(")")[0].trim();
        
        ingredient.name = nameAndForm[0].trim();

        const updatedIngredient: ExtendedIngredient = new ExtendedIngredient()
    
        const index = ingredients.indexOf(ingredient);
        ingredients[index] = updatedIngredient;
    }

    
    console.log(recipe.ingredients);
    return null;
}
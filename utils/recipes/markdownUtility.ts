import { NewRecipe } from '@/type/Recipe';
import 'dotenv/config'
import { Recipe } from "recipemd";

interface times 
{
    prepTime: string,
    cookTime: string
}

/**
 * Extracts contents of File object as a string.
 * @summary Extracts contents of File object as a string.
 * @param file - The file object to parse.
 * @returns A string representing the content of a file object.
 */
export async function extractTextFromFile(file: File): Promise<string | null>
{
    // Ensure the file isn't too big
    if (file.size > Number(process.env.MAX_RECIPE_FILE_SIZE))
    {
        return null;
    }

    // Parse the file's text contents
    const content = await file.text();

    return content;
}

/**
 * Parses a markdown formatted string and packages it as a NewRecipe.
 * @param markdownText - Markdown formatted string representing a recipe.
 * @returns A NewRecipe object.
 */
export async function parseRecipeMarkdownText(markdownText: string): Promise<null | NewRecipe>
{

    // Parse the recipe into a RecipeMd recipe object
    const recipe = Recipe.parse(markdownText);

    // Make sure the recipe is well formed
    if (!(recipe.instructions && recipe.description))
    {
        return null;
    }

    // Parse the prep time and cook time from the description
    const { prepTime, cookTime } = parseTimesFromDescription(recipe.description);

    // Ensure prep time and cook time were included in the recipe
    if (!(prepTime && cookTime)) return null;

    // Set up a NewRecipe object for conversion from RecipeMd
    const newRecipe: NewRecipe = {
        name: recipe.title,
        ingredients: [], 
        instructions: recipe.instructions,
        dietTags: recipe.tags,
        prepTime: prepTime,
        cookTime: cookTime
    };
    
    // Parse out form from ingredient name
    for (const ingredient of recipe.ingredients)
    {
        const nameAndForm = ingredient.name.split("(");

        if (nameAndForm.length != 2) return null;
        if (!(ingredient.amount)) return null;
        if (!(ingredient.amount.unit && ingredient.amount.factor)) return null;

        const name = nameAndForm[0].trim();

        let form: string;

        if (nameAndForm.length > 1)
            form = nameAndForm[1].split(")")[0].trim();
        else
            return null;

        // Repackage the ingredient
        newRecipe.ingredients.push(
            {   name: name, 
                form: form, 
                quantity: ingredient.amount.factor, 
                quantityUnit: ingredient.amount.unit
            });
    }

    return newRecipe;
}

/**
 * Parses prep times and cook times out of a recipe description.
 * @param description - A string representing the description of the recipe.
 * @returns times - Object containing the prep time and cook time.
 */
function parseTimesFromDescription(description: string): times
{
    description = description.toLocaleLowerCase();
    let prepTime = "";
    let cookTime = "";

    if (description.includes('prep time:'))
        prepTime = description.split('prep time:')[1].split("\n")[0].trim();
    if (description.includes('cook time:'))
        cookTime = description.split('cook time:')[1].split("\n")[0].trim();
    
    return {prepTime: prepTime, cookTime: cookTime};
}
export type Recipe = {
    id: string,
    name: string,
    ingredients: Ingredient[],
    instructions: string,
    prepTime: string,
    cookTime: string,
    dateAdded: Date,
    dateUpdated: Date,
    Diet: Diet[],
    userId: string
}

export type Ingredient = {
    id: string,
    name: string,
    quantityUnit: string,
    quantity: number,
    form: string
}

export type Diet = {
    name: string,
    id: string
}

export type RecipeControllerResponse = {
    status: number;
    payload: Recipe[] | Recipe | Ingredient[] | string;
}

export type NewRecipe = Omit<Recipe, "id" | "userId" | "dateAdded" | "dateUpdated">;
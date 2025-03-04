export type Recipe = {
    id: string,
    name: string,
    ingredients: Ingredient[],
    instructions: string,
    prepTime: string,
    cookTime: string,
    dateAdded: Date,
    dateUpdated: Date,
    dietTags: DietTag[],
    userId: string
}

export type NewRecipe = {
    name: string,
    ingredients: Ingredient[],
    instructions: string,
    prepTime: string,
    cookTime: string,
    dietTags: string[]
}

export type Ingredient = {
    id: string,
    name: string,
    quantityUnit: string,
    quantity: number,
    form: string
}

export type DietTag = {
    name: string
}

export type RecipeControllerResponse = {
    status: number;
    payload: Recipe[] | Recipe | Ingredient[] | string;
}

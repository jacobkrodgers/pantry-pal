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
    isPublic: boolean,
    userId: string
}

export type DisplayRecipe = {
    id: string,
    name: string,
    ingredients: Ingredient[],
    instructions: string,
    prepTime: string,
    cookTime: string,
    dateAdded: Date,
    dateUpdated: Date,
    dietTags: DietTag[],
    isPublic: boolean,
    userId: string
    user: {
        username: string
    }
}


export type Ingredient = {
    id: string,
    name: string,
    quantityUnit: string,
    quantity: number,
    form: string
}

export type NewRecipe = {
    name: string,
    ingredients: NewIngredient[],
    instructions: string,
    prepTime: string,
    cookTime: string,
    dietTags: string[],
    isPublic?: boolean
}

export type NewIngredient = {
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

export type RecipeFilterCheckboxes = {
    haveIngredients: boolean
    lowOnIngredients: boolean
    mightHaveIngredients: boolean
    dontHaveIngredients: boolean
}
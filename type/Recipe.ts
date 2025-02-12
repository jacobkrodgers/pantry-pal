export type User = {
    username: string,
    id: string
};

export type Recipe = {
    id: string,
    name: string,
    ingredients: Ingredient[],
    instructions: string,
    prepTime: string,
    cookTime: string,
    dateAdded: Date,
    dateUpdated: Date,
    dietCompatability: Diet[],
    user: User,
    userId: string
}

export type Ingredient = {
    name: string,
    quantityUnit: string,
    quantity: number,
    form: string
}

export type Diet = {
    name: string
}
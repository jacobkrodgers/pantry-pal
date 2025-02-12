export type User = {
    username: string,
    id: string
};

export type Recipe = {
    name: string,
    owner: User,
    ingredients: Ingredient[],
    instructions: string,
    prepTime: string,
    cookTime: string,
    dietCompatability: Diet[]
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
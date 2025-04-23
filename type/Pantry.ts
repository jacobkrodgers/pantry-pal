import { Ingredient } from "./Recipe";

export type Pantry = {
    ingredients: Ingredient[],
    id: string,
    userId: string
}
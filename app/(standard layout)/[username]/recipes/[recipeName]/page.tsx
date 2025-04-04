"use client";

import { Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecipe } from "./actions";
import { Recipe } from "@/type/Recipe";
import RecipeHeader from "@/Components/Recipe/RecipeHeader";
import RecipeBody from "@/Components/Recipe/RecipeBody";

export default function Page() {
    const params = useParams<{ username: string; recipeName: string }>();

    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        async function fetchRecipe() {
            const data = await getRecipe(params.username, params.recipeName);
            setRecipe(data);
        }

        fetchRecipe();
    }, [params]);

    if (!recipe) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <>
            <RecipeHeader name={recipe.name} dietTags={recipe.dietTags} username={recipe.authorUsername!} created={recipe.dateAdded} updated={recipe.dateUpdated} />
            <RecipeBody prepTime={recipe.prepTime} cookTime={recipe.prepTime} ingredients={recipe.ingredients} ingredientsOnHand={[]} directions={recipe.instructions} highlight={true} />
        </>
    );
}

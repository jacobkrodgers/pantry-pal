"use client";

import { Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import RecipePage from "@/Components/Recipe/RecipePage";
import { getRecipe } from "./actions";
import { Recipe } from "@/type/Recipe";

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

    return <RecipePage recipe={recipe} />;
}

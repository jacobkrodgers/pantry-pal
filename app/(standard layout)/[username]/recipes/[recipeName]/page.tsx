"use client";

import { FormControlLabel, FormGroup, Paper, Switch, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPantry, getRecipe } from "./actions";
import { Ingredient, Recipe } from "@/type/Recipe";
import RecipeHeader from "@/Components/Recipe/RecipeHeader";
import RecipeBody from "@/Components/Recipe/RecipeBody";

export default function Page() {
    const params = useParams<{ username: string; recipeName: string }>();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [pantryIngredients, setPantryIngredients] = useState<Ingredient[] | []>([]);
    const [highlight, setHighlight] = useState(true);

    const toggleHighlight = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHighlight(event.target.checked);
    };

    useEffect(() => {
        async function fetchData() {
            const recipeData = await getRecipe(params.username, params.recipeName);
            setRecipe(recipeData);

            const pantryData = await getPantry();
            setPantryIngredients(pantryData);
        }

        fetchData();
    }, [params]);

    if (!recipe) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <>
            <FormGroup sx={{mx: 3, mt: 3}}>
                <FormControlLabel 
                    control={<Switch checked={highlight} onChange={toggleHighlight}/>} 
                    label="Show Ingredient Indicators"
                    labelPlacement="start"
                />
            </FormGroup>
            <Paper sx={{ mx: 3, mb: 3, p: 2 }}>
                <RecipeHeader 
                    name={recipe.name} 
                    dietTags={recipe.dietTags} 
                    username={recipe.authorUsername!} 
                    created={recipe.dateAdded} 
                    updated={recipe.dateUpdated} 
                />
                <RecipeBody 
                    prepTime={recipe.prepTime} 
                    cookTime={recipe.prepTime} 
                    recipeIngredients={recipe.ingredients} 
                    pantryIngredients={pantryIngredients} 
                    directions={recipe.instructions} 
                    highlight={highlight} 
                />
            </Paper>
        </>
    );
}

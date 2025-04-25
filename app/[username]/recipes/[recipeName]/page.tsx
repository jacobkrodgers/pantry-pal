"use client";

import { Box, FormControlLabel, FormGroup, Paper, Switch, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecipe } from "./actions";
import { Recipe } from "@/type/Recipe";
import RecipeHeader from "@/Components/Recipe/RecipeHeader";
import RecipeBody from "@/Components/Recipe/RecipeBody";
import theme from "@/app/theme";
import { usePantry } from "@/Components/Providers/PantryProvider";

export default function Page() {
    const params = useParams<{ username: string; recipeName: string }>();
    const { pantryItems } = usePantry();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [highlight, setHighlight] = useState(true);

    const toggleHighlight = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHighlight(event.target.checked);
    };

    useEffect(() => {
        async function fetchData() {
            const recipeData = await getRecipe(params.username, params.recipeName);
            setRecipe(recipeData);
        }

        fetchData();
    }, [params]);

    if (!recipe) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ pb: 5 }}>
            <FormGroup sx={{ mx: 3, mt: 3 }}>
                <FormControlLabel 
                    control={<Switch checked={highlight} onChange={toggleHighlight} />} 
                    label="Show Ingredient Indicators"
                    labelPlacement="start"
                />
            </FormGroup>
            <Paper sx={{ mx: 3, p: 2, minHeight: `calc(100vh - ${theme.spacing(20)})` }}>
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
                    pantryIngredients={pantryItems} 
                    directions={recipe.instructions} 
                    highlight={highlight} 
                />
            </Paper>
        </Box>
    );
}

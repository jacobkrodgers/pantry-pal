"use client";

import { Box, Button, FormControlLabel, FormGroup, Paper, Switch, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteRecipe, getRecipe } from "./actions";
import { DisplayRecipe, Recipe } from "@/type/Recipe";
import RecipeHeader from "@/Components/Recipe/RecipeHeader";
import RecipeBody from "@/Components/Recipe/RecipeBody";
import theme from "@/app/theme";
import { usePantry } from "@/Components/Providers/PantryProvider";

export default function Page() {
    const params = useParams<{ username: string; recipeName: string }>();
    const { pantryItems } = usePantry();
    const [recipe, setRecipe] = useState<DisplayRecipe | null>(null);
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
            <Paper sx={{ mx: 3, p: 2, minHeight: `calc(100vh - ${theme.spacing(25)})` }}>
                <RecipeHeader 
                    name={recipe.name} 
                    dietTags={recipe.dietTags} 
                    username={recipe.user.username} 
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 3, pt: 2 }}>
                <Button
                    variant="contained"
                    color='error'
                    onClick={() => deleteRecipe(recipe.id)}
                >
                    Delete Recipe
                </Button>
            </Box>
        </Box>
    );
}

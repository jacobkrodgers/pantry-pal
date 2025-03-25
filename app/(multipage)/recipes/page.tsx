'use client'

import RecipePreview from '@/Components/Recipe/RecipePreview';
import { Ingredient, NewIngredient, Recipe } from '@/type/Recipe';
import { Box, Pagination, InputBase } from '@mui/material';
import { useState, useEffect } from 'react';
import { getRecipes } from './actions';
import theme from '@/app/theme';

export default function Page() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchString, setSearchString] = useState<string>("");
    const [currPageNumber, setCurrPageNumber] = useState<number>(1);
    const [recipesPerPage, setRecipesPerPage] = useState<number>(5);
    const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([]);
    const [filterIngredients, setFilterIngredients] = useState<boolean>(false);
    const [ingredientsOnHand, setIngredientsOnHand] = useState<NewIngredient[]>([]);

    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrPageNumber(1);
        setSearchString(e.target.value);
    };

    useEffect(() => {
        async function fetchRecipes() {
            const data = await getRecipes(searchString, currPageNumber, recipesPerPage);
            setRecipes(data ?? []);
        }
        fetchRecipes();
    }, [searchString, currPageNumber, recipesPerPage]);

    useEffect(() => {
        setDisplayedRecipes(recipes.slice((currPageNumber - 1) * recipesPerPage, currPageNumber * recipesPerPage));
    }, [recipes, currPageNumber]);

    return (
        <>
            <Box 
                sx={{ 
                    width: "100%", 
                    padding: 2, 
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: theme.palette.primary.main
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search for recipes..."
                    inputProps={{ 'aria-label': 'search recipes' }}
                    onChange={handleStringChange}
                />
            </Box>
            
            <Box sx={{ p: 3 }}>
                {displayedRecipes.map((recipe, index) => (
                    <RecipePreview key={index} recipe={recipe} ingredientsOnHand={ingredientsOnHand} filterIngredients={filterIngredients}/>
                ))}
            </Box>

            {recipes.length > recipesPerPage && (
                <Box sx={{ display: "flex", justifyContent: "center", pb: 4 }}>
                    <Pagination
                        count={Math.ceil(recipes.length / recipesPerPage)}
                        page={currPageNumber}
                        onChange={(_e, value) => setCurrPageNumber(value)}
                        color="primary"
                        shape="rounded"
                        size="large"
                        showFirstButton 
                        showLastButton
                    />
                </Box>
            )}
        </>
    );
}

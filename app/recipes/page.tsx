'use client'

import RecipePreview from '@/Components/Recipe/RecipePreview';
import { DisplayRecipe, Ingredient } from '@/type/Recipe';
import { Box, Pagination } from '@mui/material';
import { useState, useEffect } from 'react';
import { getPantry, getRecipes } from './actions';
import RecipesFilters from '@/Components/Recipe/RecipesFilters';
import { SelectChangeEvent } from '@mui/material';

export default function Page() {
    const [recipes, setRecipes] = useState<DisplayRecipe[]>([]);
    const [searchString, setSearchString] = useState<string>("");
    const [currPageNumber, setCurrPageNumber] = useState<number>(1);
    const [recipesPerPage, setRecipesPerPage] = useState<number>(5);
    const [totalRecipes, setTotalRecipes] = useState<number>(0);
    const [highlight, setHighlight] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [checkboxes, setCheckboxes] = useState({
        haveIngredients: false,
        lowOnIngredients: false,
        mightHaveIngredients: false,
        dontHaveIngredients: false,
      });
    const [pantry, setPantry] = useState<Ingredient[]>([]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrPageNumber(1);
        setCheckboxes({
          ...checkboxes,
          [event.target.name]: event.target.checked,
        });
      };

    const handleSearchUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrPageNumber(1);
        setSearchString(e.target.value);
    };

    useEffect(() => {
        async function fetchRecipes() {
            const recipeData = await getRecipes(
                searchString, currPageNumber, recipesPerPage, 
                sortBy, sortAsc, highlight, checkboxes);
            setRecipes(recipeData.payload!.recipes);
            setTotalRecipes(recipeData.payload!.count)

            const pantryData = await getPantry();
            setPantry(pantryData.payload ? pantryData.payload.ingredients : []);
        }
        fetchRecipes();
    }, [searchString, currPageNumber, recipesPerPage, sortBy, sortAsc, checkboxes]);

    function toggleHighlight()
    {
        setHighlight(!highlight)
    }

    function changeSortBy(event: SelectChangeEvent<string>) {
        setSortBy(event.target.value);
    }

    function toggleSortAsc()
    {
        setSortAsc(!sortAsc)
    }
    

    return (
        <>
            <RecipesFilters 
                handleSearchUpdate={handleSearchUpdate} 
                highlight={highlight} 
                toggleHighlight={toggleHighlight} 
                sortBy={sortBy} 
                changeSortBy={changeSortBy} 
                sortAsc={sortAsc} 
                toggleSortAsc={toggleSortAsc} 
                checkboxes={checkboxes} 
                handleCheckboxChange={handleCheckboxChange}
            />
            <Box sx={{ p: 3 }}>
                {recipes.map((recipe, index) => (
                    <RecipePreview 
                        key={index} 
                        recipe={recipe} 
                        pantryIngredients={pantry} 
                        highlight={highlight} 
                        username={recipe.user.username}/>
                ))}
            </Box>

            {totalRecipes > recipesPerPage && (
                <Box 
                    sx={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        pb: 4 
                    }}
                >
                    <Pagination
                        count={Math.ceil(totalRecipes / recipesPerPage)}
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

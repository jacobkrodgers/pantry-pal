'use client'

import RecipePreview from '@/Components/Recipe/RecipePreview';
import { DisplayRecipe, Ingredient } from '@/type/Recipe';
import { Box, Button, Modal, Pagination } from '@mui/material';
import { useState, useEffect } from 'react';
import { getPantry, getRecipes } from './actions';
import RecipesFilters from '@/Components/Recipe/RecipesFilters';
import { SelectChangeEvent } from '@mui/material';
import { usePantry } from '@/Components/Providers/PantryProvider';
import NewRecipe from '@/Components/Recipe/NewRecipe';

export default function Page() 
{

    const {pantryItems} = usePantry();

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
    const [newRecipeModalOpen, setNewRecipeModalOpen] = useState(false);

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
        }
        fetchRecipes();
    }, [searchString, currPageNumber, recipesPerPage, sortBy, sortAsc, checkboxes, pantryItems]);

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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 3, pt: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => setNewRecipeModalOpen(!newRecipeModalOpen)}
                >
                    + New Recipe
                </Button>
            </Box>
            <Box sx={{ p: 3 }}>
                {recipes.map((recipe, index) => (
                    <RecipePreview 
                        key={index} 
                        recipe={recipe} 
                        pantryIngredients={pantryItems} 
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

                <Modal open={newRecipeModalOpen} onClose={()=>setNewRecipeModalOpen(false)}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        minWidth: 800,
                        maxWidth: 800,
                    }}>
                        <NewRecipe />
                    </Box>
                </Modal>
        </>
    );
}

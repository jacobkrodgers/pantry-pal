'use client'

import { DisplayRecipe, Ingredient, Recipe } from "@/type/Recipe";
import { Paper, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RecipeHeader from "./RecipeHeader";
import RecipeBody from "./RecipeBody";
import Link from "next/link";

interface RecipePreviewProps
{
    recipe: DisplayRecipe,
    pantryIngredients: Ingredient[],
    username: string,
    highlight: boolean
}

export default function RecipePreview(
  {recipe, pantryIngredients, highlight, username}: 
  RecipePreviewProps)
{
  return (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            maxWidth: '100%', // Ensure it takes up full width
            paddingBottom: 2, // Padding around the content
        }}
        >
        <Paper>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                <Box 
                    sx={{
                        width: '100%', 
                        maxWidth: '100%'
                    }}>
                <RecipeHeader 
                    name={recipe.name} 
                    dietTags={recipe.dietTags} 
                    username={username} 
                    created={recipe.dateAdded} 
                    updated={recipe.dateUpdated}
                />
                </Box>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                        }
                    }}
                >
                    <Link 
                        href={`/user/recipes/${recipe.name.replaceAll(" ", "%20")}`} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <RecipeBody 
                            prepTime={recipe.prepTime} 
                            cookTime={recipe.cookTime} 
                            recipeIngredients={recipe.ingredients} 
                            directions={recipe.instructions} 
                            pantryIngredients={pantryIngredients} 
                            highlight={highlight}
                        />
                    </Link>
                </AccordionDetails>
            </Accordion>
        </Paper>
    </Box>
    );
}

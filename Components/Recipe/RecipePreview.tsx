'use client'

import { Ingredient, Recipe } from "@/type/Recipe";
import { Paper, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Chip } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FC } from 'react';
import RecipePage from './RecipePage';  // Import your RecipePage component
import RecipeHeader from "./RecipeHeader";
import RecipeBody from "./RecipeBody";
import Link from "next/link";

interface RecipePreviewProps
{
    recipe: Recipe,
    ingredientsOnHand: Ingredient[],
    filterIngredients: boolean
}

export default function RecipePreview({recipe, ingredientsOnHand=[], filterIngredients=false}: RecipePreviewProps)
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
            <Box sx={{width: '100%', maxWidth: '100%'}}>
              <RecipeHeader name={recipe.name} dietTags={recipe.dietTags} username={recipe.authorUsername!} created={recipe.dateAdded} updated={recipe.dateUpdated}/>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',  // This gives a subtle shading
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  // Optional: adds a shadow on hover
                cursor: 'pointer',
              }
            }}
          >
            <Link href={`${recipe.authorUsername}/recipes/${recipe.name.replaceAll(" ", "%20")}`} onClick={(e) => e.stopPropagation()}>
              <RecipeBody prepTime={recipe.prepTime} cookTime={recipe.cookTime} ingredients={recipe.ingredients} directions={recipe.instructions} ingredientsOnHand={ingredientsOnHand} filterIngredients={filterIngredients}/>
            </Link>
          </AccordionDetails>
        </Accordion>
      </Paper>
      </Box>
    );
}

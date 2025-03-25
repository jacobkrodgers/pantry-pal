import React from 'react';
import { ListItem, ListItemText, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CircleIcon from '@mui/icons-material/Circle';
import { Ingredient } from '@/type/Recipe';

interface IngredientIndicatorProps
{
    ingredients: Ingredient[],
    ingredientsOnHand: Ingredient[],
    filterIngredients: boolean
    
}
export default function IngredientIndicator({ ingredients, ingredientsOnHand, filterIngredients }: IngredientIndicatorProps)
{
    return ingredients.map((ingredient, index) => {
        const isOnHand = ingredientsOnHand.some(item =>
            item.name.toLowerCase() === ingredient.name.toLowerCase() &&
            item.form.toLowerCase() === ingredient.form.toLowerCase() &&
            item.quantity === ingredient.quantity &&
            item.quantityUnit.toLowerCase() === ingredient.quantityUnit.toLowerCase()
        );
        
        return (
            <ListItem key={index} sx={{ display: "flex", alignItems: "center", pl: 0 }}>
                {filterIngredients ? (
                    isOnHand ? 
                        <CheckCircleIcon color="success" sx={{ pr: 1, fontSize: 30 }} /> : 
                        <CancelIcon color="error" sx={{ pr: 1, fontSize: 30 }} />
                ) : (
                    <CircleIcon sx={{ pr: 1 }} /> // Bullet point icon with larger size
                )}
                <ListItemText sx={{ display: 'list-item', pl: 1 }}>
                    <Typography>{ingredient.quantity} {ingredient.quantityUnit} {ingredient.name} {ingredient.form}</Typography>
                </ListItemText>
            </ListItem>
        );
    });
};
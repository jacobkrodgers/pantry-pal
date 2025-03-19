'use client'

import { Recipe } from "@/type/Recipe";
import { 
    Box, 
    Divider, 
    List, 
    ListItem, 
    ListItemText, 
    Typography } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link as MUILink } from '@mui/material';
import Link from 'next/link'

export default function RecipePage({ recipe }: { recipe: Recipe })
{   
    return(
    <>
        <List>
            <Typography variant="h4">
                {recipe.name}
            </Typography>
        </List>
        <Divider />
        <List>
        <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">
                    Author: {" "} 
                        <MUILink underline="none" component={Link} href={recipe.authorUsername!}>{recipe.authorUsername}</MUILink>
                </Typography>
                <Box textAlign="right">
                    <Typography variant="caption" sx={{ display: 'block' }}>
                        Created: {recipe.dateAdded.toDateString()}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                        Updated: {recipe.dateUpdated.toDateString()}
                    </Typography>
                </Box>
            </Box>
        </List>
        <Divider />
        <List>
            <Typography variant="body2">
                <AccessTimeIcon /> Prep Time: {recipe.prepTime}
            </Typography>
            <Typography variant="body2">
                <AccessTimeIcon /> Cook Time: {recipe.cookTime}
            </Typography>
        </List>
        <List>
                {recipe.dietTags.map((tag, index) => (
                    <Typography key={index}>{tag.name}</Typography>
            ))}
        </List>
        <Divider textAlign="left"><Typography variant="h5">Ingredients</Typography></Divider>
            <List dense={true} sx={{ listStyleType: 'disc' }}>
                {recipe.ingredients.map((ingredient, index) =>(
                    <ListItem key={index} >
                        <ListItemText sx={{ display: 'list-item' }}>
                            <Typography>{ingredient.quantity} {ingredient.quantityUnit} {ingredient.name} {ingredient.form}</Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        <Divider textAlign="left"><Typography variant="h5">Directions</Typography></Divider>
        <List>
            <ListItem>
                <ListItemText>
                    <Typography>
                        {recipe.instructions}
                    </Typography>
                </ListItemText>
            </ListItem>
        </List>
    </>
    )
}
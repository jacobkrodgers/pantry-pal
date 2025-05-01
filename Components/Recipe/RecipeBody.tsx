import { Ingredient } from "@/type/Recipe";
import { Box, Divider, List, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import IngredientListItem from "./IngredientListItem";

interface RecipeBodyProps 
{
    prepTime: string;
    cookTime: string;
    recipeIngredients: Ingredient[];
    pantryIngredients: Ingredient[] | [];
    directions: string;
    highlight?: boolean;
}

export default function RecipeBody(
    { prepTime, cookTime, recipeIngredients, 
        pantryIngredients, directions, highlight = true }: RecipeBodyProps) 
{
    return (
        <>
            <List>
                <Typography variant="body2">
                    <AccessTimeIcon /> Prep Time: {prepTime}
                </Typography>
                <Typography variant="body2">
                    <AccessTimeIcon /> Cook Time: {cookTime}
                </Typography>
            </List>
            <Divider textAlign="left">
                <Typography variant="h5">Ingredients</Typography>
            </Divider>
            <List dense={true} sx={{ pl: 0, listStylePosition: "inside" }}>
                {
                    recipeIngredients.map((recipeIngredient, index) => 
                    {
                        const ingredientOnHand = pantryIngredients.find(
                            item => item.name === recipeIngredient.name && 
                            item.form === recipeIngredient.form
                        );

                        return (
                            
                            <IngredientListItem 
                                key={index} 
                                ingredient={recipeIngredient} 
                                pantryIngredient={ingredientOnHand}
                                highlight={highlight} 
                            />
                        );
                    })
                }
            </List>

            <Divider textAlign="left">
                <Typography variant="h5">Directions</Typography>
            </Divider>
            <Box sx={{pt: 2}}>
                {directions.split('\n').map((line, index) => (
                        <Typography key={index} sx={{wordBreak: 'break-word'}}>{line}</Typography>
                 ))}
            </Box>
        </>
    );
}

import { Ingredient } from "@/type/Recipe";
import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import IngredientListItem from "./IngredientListItem";

interface RecipeBodyProps 
{
    prepTime: string;
    cookTime: string;
    ingredients: Ingredient[];
    ingredientsOnHand: Ingredient[];
    directions: string;
    highlight?: boolean;
}

export default function RecipeBody({ prepTime, cookTime, ingredients, directions, ingredientsOnHand, highlight = true }: RecipeBodyProps) {
    
    ingredientsOnHand = [{
        id: "12345",
        name: "Rice",
        quantityUnit: "gram",
        quantity: 0.000,
        form: "None"
    }];
    
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
                    ingredients.map((ingredient, index) => 
                    {
                        const ingredientOnHand = ingredientsOnHand.find(
                            item => item.name === ingredient.name && item.form === ingredient.form
                        );

                        return (
                            
                            <IngredientListItem 
                                key={ingredient.name} 
                                ingredient={ingredient} 
                                ingredientOnHand={ingredientOnHand}
                                highlight={highlight} 
                            />
                        );
                    })
                }
            </List>

            <Divider textAlign="left">
                <Typography variant="h5">Directions</Typography>
            </Divider>
            <List>
                <ListItem>
                    <ListItemText>
                        <Typography>{directions}</Typography>
                    </ListItemText>
                </ListItem>
            </List>
        </>
    );
}

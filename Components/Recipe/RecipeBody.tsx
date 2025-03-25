import { Ingredient } from "@/type/Recipe";
import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CircleIcon from '@mui/icons-material/Circle';  // Bullet point icon
import IngredientIndicator from "./IngredientIndicator";

interface RecipeBodyProps {
    prepTime: string;
    cookTime: string;
    ingredients: Ingredient[];
    directions: string;
    ingredientsOnHand: Ingredient[];
    filterIngredients?: boolean;
}

export default function RecipeBody({ prepTime, cookTime, ingredients, directions, ingredientsOnHand, filterIngredients = false }: RecipeBodyProps) {
    // Example data, you can remove this part when using actual props
    ingredientsOnHand = [{
        id: "12345",
        name: "Rice",
        quantityUnit: "Cups",
        quantity: 5,
        form: "None"
    }];
    
    filterIngredients = false;

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
                <IngredientIndicator ingredients={ingredients} ingredientsOnHand={ingredientsOnHand} filterIngredients={filterIngredients} />
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

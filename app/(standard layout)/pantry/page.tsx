import Pantry from "@/Components/Pantry/Pantry";
import PantryShoppingListWrapper from "@/Components/Pantry/PantryShoppingListWrapper";
import { Divider, List, Typography } from "@mui/material";

export default function Page()
{
    let pantry = [{
        id: "12345",
        name: "Rice",
        quantityUnit: "gram",
        quantity: 0.000,
        form: "None"
    },
    {
        id: "12345",
        name: "Rice",
        quantityUnit: "gram",
        quantity: 0.000,
        form: "None"
    }]
    ;

    return(<>
    <List>
        {/* <Typography variant="h4" sx={{ display: 'inline'}}>
                    My Pantry
                </Typography>
                </List>
                <Divider sx={{mb:2}}/>
                <List>
    <Pantry pantryItems={pantry} />  */}
    <PantryShoppingListWrapper pantryItems={pantry} shoppingListItems={pantry}/>
    </List>
        </>)
}
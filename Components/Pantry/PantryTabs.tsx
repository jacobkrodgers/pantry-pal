'use client'

import { useEffect, useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Pantry from "./Pantry";
import { Ingredient } from "@/type/Recipe";
import { getPantry, getShoppingList } from './actions';
import { usePantry } from '@/Components/Providers/PantryProvider';

export default function PantryTabs() {
    const [tabIndex, setTabIndex] = useState(0);
    const { pantryItems, setPantryItems, shoppingListItems, setShoppingListItems } = usePantry();

    useEffect(() => {
        async function fetchData() {
            const pantryResponse = await getPantry();
            const shoppingListResponse = await getShoppingList();
    
            if (pantryResponse.status === 201 && pantryResponse.payload) {
                setPantryItems(pantryResponse.payload.ingredients || []);
            }
            if (shoppingListResponse.status === 201 && shoppingListResponse.payload) {
                setShoppingListItems(shoppingListResponse.payload.ingredients || []);
            }
        }
    
        fetchData();
    }, []);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box id="modal-content" sx={{ width: "100%" }}>
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="Pantry and Shopping List Tabs"
                sx={{ mb: 3 }}
                centered
            >
                <Tab label="Pantry" />
                <Tab label="Shopping List" />
            </Tabs>

            {tabIndex === 0 && 
                <Pantry 
                    tabName={"Pantry"} 
                    pantryItems={pantryItems}
                    setPantryItems={setPantryItems} 
                />
            }
            {tabIndex === 1 && 
                <Pantry 
                    tabName={"Shopping List"} 
                    pantryItems={shoppingListItems}
                    setPantryItems={setShoppingListItems} 
                />
            }
        </Box>
    );
}

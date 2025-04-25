// context/PantryContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { Ingredient } from '@/type/Recipe';
import { getPantry, getShoppingList } from './actions';

interface PantryContextProps {
    pantryItems: Ingredient[];
    setPantryItems: React.Dispatch<React.SetStateAction<Ingredient[]>>;
    shoppingListItems: Ingredient[];
    setShoppingListItems: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

const PantryContext = createContext<PantryContextProps | undefined>(undefined);

export const PantryProvider = ({ children }: { children: React.ReactNode }) => {
    const [pantryItems, setPantryItems] = useState<Ingredient[]>([]);
    const [shoppingListItems, setShoppingListItems] = useState<Ingredient[]>([]);

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

    return (
        <PantryContext.Provider value={{ pantryItems, setPantryItems, shoppingListItems, setShoppingListItems }}>
            {children}
        </PantryContext.Provider>
    );
};

export const usePantry = () => {
    const context = useContext(PantryContext);
    if (!context) {
        return;
    }
    return context;
};

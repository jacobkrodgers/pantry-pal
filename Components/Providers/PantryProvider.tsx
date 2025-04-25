// context/PantryContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { Ingredient } from '@/type/Recipe';
import { getPantry, getShoppingList, addPantryItem, addShoppingListItem } from './actions';

interface PantryContextType {
    pantryItems: Ingredient[];
    setPantryItems: React.Dispatch<React.SetStateAction<Ingredient[]>>;
    shoppingListItems: Ingredient[];
    setShoppingListItems: React.Dispatch<React.SetStateAction<Ingredient[]>>;
    refreshPantry: () => Promise<void>;
    refreshShoppingList: () => Promise<void>;
}

// Instead of defaulting to undefined, pass a dummy fallback (you’ll never use it)
const PantryContext = createContext<PantryContextType | null>(null);

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

    const refreshPantry = async () => {
        const result = await getPantry();

        if (result.status === 201) {
            setPantryItems(result.payload!.ingredients);
        }
    };

    const refreshShoppingList = async () => {
        const result = await getShoppingList();

        if (result.status === 201) {
            setShoppingListItems(result.payload!.ingredients);
        }
    };
    

    return (
        <PantryContext.Provider value={{ pantryItems, setPantryItems, shoppingListItems, setShoppingListItems, refreshPantry, refreshShoppingList }}>
            {children}
        </PantryContext.Provider>
    );
};

export const usePantry = (): PantryContextType => {
    const context = useContext(PantryContext);
    if (!context) {
        throw new Error('usePantry must be used within a PantryProvider');
    }
    return context;
};

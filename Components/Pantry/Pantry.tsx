'use client';

import { Ingredient } from "@/type/Recipe";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Divider,
    IconButton,
    List,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from 'react';
import NewPantryItemInputs from "./NewPantryItemInputs";
import { deleteItemById, getPantry, getShoppingList, updateItem } from './actions';
import { capitalize } from "@/utils/stringUtils";

interface PantryProps 
{
    tabName: string;
    pantryItems: Ingredient[];
    setPantryItems: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

export default function Pantry({ tabName, pantryItems, setPantryItems }: PantryProps) 
{
    const [currentPantryItems, setCurrentPantryItems] = useState<Ingredient[]>([]);
    const [errorRefresh, setErrorRefresh] = useState(false);
    const [saveError, setSaveError] = useState(false);

    useEffect(() => {
        fetchPantryItems();
    }, []);

    const fetchPantryItems = async () => {
        const response = tabName === "Pantry" ? await getPantry() : await getShoppingList();
        if (response.status === 201 && response.payload) 
        {
            setCurrentPantryItems(response.payload.ingredients || []);
            setPantryItems(response.payload.ingredients || []);
        }
    };

    const handleItemChange = (id: string, field: keyof Ingredient, value: any) => {
        setCurrentPantryItems((prevItems) =>
            prevItems.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const disableSaveCheck = (ingredient: Ingredient) => {
        const original = pantryItems.find(item => item.id === ingredient.id);
        return (
            ingredient.quantity === 0 ||
            ingredient.quantityUnit.trim() === '' ||
            (original &&
                ingredient.quantity === original.quantity &&
                ingredient.quantityUnit === original.quantityUnit)
        );
    };

    const handleSave = async (ingredient: Ingredient) => {
        setErrorRefresh(false);
        const response = await updateItem(
            ingredient.id, ingredient.quantity, 
            ingredient.quantityUnit);
        if (response.status !== 200 || !response.payload) {
            setSaveError(true);
        }
        fetchPantryItems();
    };

    const handleDeleteItem = async (id: string) => {
        await deleteItemById(id);
        await fetchPantryItems();
    };

    const pantryType = tabName === "Pantry" ? "pantry" : "shoppingList";

    return (
        <>
            <List>
                <Typography variant="h4" sx={{ display: 'inline' }}>
                    My {tabName}
                </Typography>
            </List>
            <Divider sx={{ mb: 3 }} />
            <Box>
                <NewPantryItemInputs
                    onAddItem={fetchPantryItems}
                    pantryType={pantryType}
                    errorRefresh={errorRefresh}
                    setErrorRefresh={setErrorRefresh}
                />

                <Box 
                    sx={{ 
                        maxHeight: '60vh', 
                        overflowY: 'auto', 
                        pr: 1 }}
                >
                    <List>
                        {currentPantryItems.map((ingredient, index) => (
                            <Box 
                                key={index} 
                                sx={{ 
                                    mb: 2, 
                                    display: 'flex', 
                                    alignItems: 'center' }}
                            >
                                <Box 
                                    sx={{ flexGrow: 1 }}
                                >
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls={`panel-${ingredient.id}-content`}
                                            id={`panel-${ingredient.id}-header`}
                                        >
                                            <Typography 
                                                variant="body1" 
                                                sx={{ flex: 1 }}
                                            >
                                                {capitalize(ingredient.form)} {capitalize(ingredient.name)}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Divider 
                                                sx={{ mb: 2 }} 
                                            />
                                            <Box 
                                                sx={{ 
                                                    display: 'flex', 
                                                    gap: 2, 
                                                    flexDirection: 'column', 
                                                    pb: 2 
                                                }}
                                            >
                                                <TextField
                                                    label="Quantity"
                                                    type="number"
                                                    value={ingredient.quantity}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            ingredient.id, "quantity", 
                                                            Number(e.target.value))
                                                    }
                                                    sx={{ flex: 1 }}
                                                />
                                                <TextField
                                                    label="Quantity Unit"
                                                    value={ingredient.quantityUnit}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            ingredient.id, 
                                                            "quantityUnit", 
                                                            e.target.value)
                                                    }
                                                    sx={{ flex: 1 }}
                                                />
                                            </Box>
                                            <Box 
                                                sx={{ 
                                                    display: 'flex', 
                                                    gap: 2, 
                                                    justifyContent: 'flex-end' 
                                                    }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleSave(ingredient)}
                                                    disabled={disableSaveCheck(ingredient)}
                                                >
                                                    Save
                                                </Button>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                                <IconButton
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => handleDeleteItem(ingredient.id)}
                                    sx={{ ml: 2 }}
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </List>
                </Box>

                <Snackbar
                    open={saveError}
                    autoHideDuration={3000}
                    onClose={() => setSaveError(false)}
                >
                    <Alert
                        onClose={() => setSaveError(false)}
                        severity="error"
                        variant="outlined"
                        sx={{ width: '100%' }}
                    >
                        Something went wrong! Refreshing.
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
}

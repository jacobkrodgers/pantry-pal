'use client'

import { Ingredient } from "@/type/Recipe";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, IconButton, List, ListItem, TextField, Typography, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useRef } from 'react';

interface PantryProps {
    pantryItems: Ingredient[];
}

export default function Pantry({ pantryItems }: PantryProps) {
    const [currentPantryItems, setCurrentPantryItems] = useState(pantryItems); // Manage the state for ingredients
    const [showForm, setShowForm] = useState(false); // State to show/hide the form
    const formRef = useRef<HTMLFormElement>(null); // Reference to the form for the new ingredient

    const handleDelete = (event: React.MouseEvent, id: string) => {
        event.stopPropagation();
        setCurrentPantryItems(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id)); // Remove ingredient by id
    };

    const handleAdd = () => {
        // Access form values using the ref
        const form = formRef.current;
        if (form) {
            const newIngredient: Ingredient = {
                id: Math.random().toString(36).substr(2, 9), // Generate a simple random ID for the ingredient
                form: form.form.value,
                name: form.name.value,
                quantity: Number(form.quantity.value),
                quantityUnit: form.quantityUnit.value,
            };

            // Add the new ingredient to the list
            setCurrentPantryItems(prevIngredients => [...prevIngredients, newIngredient]);

            // Clear the form after adding
            form.reset();
            setShowForm(false); // Hide the form after adding
        }
    };

    const handleCancel = () => {
        setShowForm(false); // Hide the form without adding any ingredient
    };

    return (
        <>
        <List>
            <Typography variant="h4" sx={{ display: 'inline'}}>
                        My Pantry
                    </Typography>
        </List>

                <Divider sx={{mb:3}}/>

            <Box>
                {/* Button to toggle form visibility */}
                {!showForm && (
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setShowForm(true)} // Show the form
                            sx={{
                                position: 'relative',
                                display: 'inline-block',
                            }}
                        >
                            + New Pantry Item
                        </Button>
                    </Box>
                )}

                {/* Conditional rendering of the form with smooth transition */}
                <Box
                    sx={{
                        mb: 2,
                        transition: 'all 0.5s ease-in-out',
                        opacity: showForm ? 1 : 0,
                        transform: showForm ? 'translateY(0)' : 'translateY(-20px)',
                        visibility: showForm ? 'visible' : 'hidden',
                    }}
                >
                    {showForm && (
                        <form ref={formRef}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2 }}>
                                <TextField
                                    name="form"
                                    label="Form"
                                    defaultValue=""
                                    sx={{ flex: 1 }}
                                    required
                                />
                                <TextField
                                    name="name"
                                    label="Name"
                                    defaultValue=""
                                    sx={{ flex: 1 }}
                                    required
                                />
                                <TextField
                                    name="quantity"
                                    label="Quantity"
                                    type="number"
                                    defaultValue=""
                                    sx={{ flex: 1 }}
                                    required
                                />
                                <TextField
                                    name="quantityUnit"
                                    label="Quantity Unit"
                                    defaultValue=""
                                    sx={{ flex: 1 }}
                                    required
                                />
                            </Box>

                            {/* Align buttons inside the form and horizontally with the inputs */}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleAdd}
                                >
                                    Save
                                </Button>
                            </Box>
                        </form>
                    )}
                </Box>

                <List>
                    {currentPantryItems.map((ingredient) => (
                        <Box key={ingredient.id} sx={{ mb: 2 }}>
                            <Box sx={{ position: 'relative' }}>
    {/* Accordion Component */}
    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${ingredient.id}-content`}
            id={`panel-${ingredient.id}-header`}
        >
            <Typography variant="body1" sx={{ flex: 1 }}>
                {ingredient.form} {ingredient.name}
            </Typography>
        </AccordionSummary>

        {/* AccordionDetails */}
        <AccordionDetails>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <TextField
                    label="Quantity"
                    type="number"
                    value={ingredient.quantity}
                    sx={{ flex: 1 }}
                />
                <TextField
                    label="Quantity Unit"
                    value={ingredient.quantityUnit}
                    sx={{ flex: 1 }}
                />
            </Box>
        </AccordionDetails>
    </Accordion>

    {/* Delete button positioned outside Accordion */}
    <Box
        sx={{
            position: 'absolute',
            right: -35, // Adjust based on your design to move it outside
            top: '50%', // Align to the center of the Accordion summary
            transform: 'translateY(-50%)', // Vertically center the icon
            zIndex: 1,
        }}
    >
        <IconButton
            aria-label="delete"
            color="error"
            onClick={(event) => handleDelete(event, ingredient.id)}
        >
            <DeleteForeverIcon />
        </IconButton>
    </Box>
</Box>


                        </Box>
                    ))}
                </List>
            </Box>
        </>
    );
}

'use client';

import { Ingredient, NewIngredient } from "@/type/Recipe";
import { Alert, Box, Button, Snackbar, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { ingredientStringSchema, ingredientNumberSchema } from "@/validation/ingredientValidation";
import { addPantryItem, addShoppingListItem } from "./actions";
import { useRouter } from "next/navigation";

interface NewPantryItemInputProps {
    pantryIngredients: Ingredient[];
    onAddItem: () => void;
    pantryType: string;
    errorRefresh?: boolean;
    setErrorRefresh?: (value: boolean) => void;
}

interface InputControl {
    value: string;
    error: boolean;
    helperText: string;
}

export default function NewPantryItemInputs({
    pantryIngredients,
    onAddItem,
    pantryType,
    errorRefresh = false,
    setErrorRefresh
}: NewPantryItemInputProps) {
    const [showInputs, setShowInputs] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<boolean>(errorRefresh);

    const [ingredientForm, setIngredientForm] = useState<InputControl>({ value: '', error: false, helperText: '' });
    const [ingredientName, setIngredientName] = useState<InputControl>({ value: '', error: false, helperText: '' });
    const [ingredientQuantity, setIngredientQuantity] = useState<InputControl>({ value: '', error: false, helperText: '' });
    const [ingredientQuantityUnit, setIngredientQuantityUnit] = useState<InputControl>({ value: '', error: false, helperText: '' });

    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false);

    const isDuplicate = () => {
        return pantryIngredients.some(
            (ingredient) =>
                ingredient.name.toLowerCase() === ingredientName.value.trim().toLowerCase() &&
                ingredient.form.toLowerCase() === ingredientForm.value.trim().toLowerCase()
        );
    };

    const validateString = (stringInput: string) => {
        const { error } = ingredientStringSchema.validate(stringInput);
        return error?.message;
    };

    const validateNumber = (numberInput: number) => {
        const { error } = ingredientNumberSchema.validate(numberInput);
        return error?.message;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        setFunction: Function,
        isNumber = false
    ) => {
        const { value } = e.target;

        const helperText = isNumber ? validateNumber(Number(value)) : validateString(value);
        const error = !!helperText;

        setFunction({ value, error, helperText });
    };

    const handleCancel = () => {
        const reset: InputControl = { value: '', error: false, helperText: '' };
        setIngredientForm(reset);
        setIngredientName(reset);
        setIngredientQuantity(reset);
        setIngredientQuantityUnit(reset);
        setShowInputs(false);
    };

    const handleSave = async () => {
        setErrorRefresh?.(false);
    
        const newItem: NewIngredient = {
            name: ingredientName.value.trim(),
            form: ingredientForm.value.trim(),
            quantity: Number(ingredientQuantity.value),
            quantityUnit: ingredientQuantityUnit.value.trim(),
        };
    
        let response;
        if (pantryType === "pantry") {
            response = await addPantryItem(newItem);
        } else {
            response = await addShoppingListItem(newItem);
        }
    
        if (response.status !== 201 || !response.payload) {
            setSaveError(true);
            setErrorRefresh?.(true);
            onAddItem(); // Refresh pantry here on error
        } else {
            onAddItem(); // Refresh pantry after successful save
            handleCancel();
        }
    };
    

    useEffect(() => {
        if (!ingredientForm.value || !ingredientName.value) return;

        if (isDuplicate()) {
            const duplicateMessage = `${ingredientForm.value} ${ingredientName.value} already in list.`;

            setIngredientForm(prev => ({ ...prev, error: true, helperText: duplicateMessage }));
            setIngredientName(prev => ({ ...prev, error: true, helperText: duplicateMessage }));
        } else {
            setIngredientForm(prev => ({ ...prev, error: false, helperText: '' }));
            setIngredientName(prev => ({ ...prev, error: false, helperText: '' }));
        }
    }, [ingredientForm.value, ingredientName.value]);

    useEffect(() => {
        const allValid =
            ingredientForm.value && !ingredientForm.error &&
            ingredientName.value && !ingredientName.error &&
            ingredientQuantity.value && !ingredientQuantity.error &&
            ingredientQuantityUnit.value && !ingredientQuantityUnit.error;

        setDisableSaveButton(!allValid);
    }, [ingredientForm, ingredientName, ingredientQuantity, ingredientQuantityUnit]);

    return (
        <>
            {!showInputs && (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', position: 'relative', pr: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowInputs(true)}
                        sx={{ position: 'relative', display: 'inline-block', mr: 6 }}
                    >
                        + New Item
                    </Button>
                </Box>
            )}

            {showInputs && (
                <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2, pr:7 }}>
                        <TextField
                            name="form"
                            label="Form"
                            value={ingredientForm.value}
                            sx={{ flex: 1 }}
                            onChange={(e) => handleChange(e, setIngredientForm)}
                            error={ingredientForm.error}
                            helperText={ingredientForm.helperText}
                            required
                        />
                        <TextField
                            name="name"
                            label="Name"
                            value={ingredientName.value}
                            sx={{ flex: 1 }}
                            onChange={(e) => handleChange(e, setIngredientName)}
                            error={ingredientName.error}
                            helperText={ingredientName.helperText}
                            required
                        />
                        <TextField
                            name="quantity"
                            label="Quantity"
                            type="number"
                            value={ingredientQuantity.value}
                            sx={{ flex: 1 }}
                            onChange={(e) => handleChange(e, setIngredientQuantity, true)}
                            error={ingredientQuantity.error}
                            helperText={ingredientQuantity.helperText}
                            required
                        />
                        <TextField
                            name="quantityUnit"
                            label="Quantity Unit"
                            value={ingredientQuantityUnit.value}
                            sx={{ flex: 1 }}
                            onChange={(e) => handleChange(e, setIngredientQuantityUnit)}
                            error={ingredientQuantityUnit.error}
                            helperText={ingredientQuantityUnit.helperText}
                            required
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pr:7, mb:2 }}>
                        <Button variant="outlined" color="error" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSave}
                            disabled={disableSaveButton}
                        >
                            Save
                        </Button>
                    </Box>
                </>
            )}
            <Snackbar open={saveError} autoHideDuration={3000} onClose={() => setSaveError(false)}>
                <Alert
                    onClose={() => setSaveError(false)}
                    severity="error"
                    variant="outlined"
                    sx={{ width: '100%' }}
                >
                    Something went wrong! Refreshing.
                </Alert>
            </Snackbar>
        </>
    );
}

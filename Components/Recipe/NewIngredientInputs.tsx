'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import { NewIngredient } from '@/type/Recipe';
import { ingredientStringSchema, ingredientNumberSchema, ingredientSchema } from '@/validation/ingredientValidation';
interface NewIngredientInputProps
{
    newIngredients: NewIngredient[];
    addIngredient: (newIngredient: NewIngredient) => void;
    cancelAddIngredient: () => void;
}

interface Input<T>
{
    value: T;
    errorMsg: string;
}


export default function NewIngredientInputs({
    newIngredients,
    addIngredient,
    cancelAddIngredient
}: NewIngredientInputProps) {

    const [ingredientName, setIngredientName] = useState<Input<string>>({ value: '', errorMsg: '' });
    const [ingredientForm, setIngredientForm] = useState<Input<string>>({ value: '', errorMsg: '' });
    const [ingredientQuantity, setIngredientQuantity] = useState<Input<number>>({ value: 1, errorMsg: '' });
    const [ingredientQuantityUnit, setIngredientQuantityUnit] = useState<Input<string>>({ value: '', errorMsg: ''});
    
    const [saveError, setSaveError] = useState<boolean>(false);

    const [disableSaveButton, setDisableSaveButton] = useState(true);

    useEffect(() =>
    {
        const hasErrors = Boolean(ingredientName.errorMsg) ||
                          Boolean(ingredientForm.errorMsg) ||
                          Boolean(ingredientQuantity.errorMsg) ||
                          Boolean(ingredientQuantityUnit.errorMsg);

        const hasValues = Boolean(ingredientName.value) &&
                          Boolean(ingredientForm.value) &&
                          (ingredientQuantity.value != null && !isNaN(ingredientQuantity.value)) &&
                          Boolean(ingredientQuantityUnit.value);

        const shouldDisable = hasErrors || !hasValues;

        setDisableSaveButton(shouldDisable);
        setSaveError(false);

    }, [ingredientName, ingredientForm, ingredientQuantity, ingredientQuantityUnit]);

    function handleChangeIngredientName(e: React.ChangeEvent<HTMLInputElement>)
    {
        let name = e.target.value;
        let form = ingredientForm; 

        const { error: nameValidationError } = ingredientStringSchema.validate(name);

        if (nameValidationError)
        {
            setIngredientName({value: name, errorMsg: nameValidationError.message});
            return;
        }

        for (let ingredient of newIngredients)
        {
            if (ingredient.name === name && ingredient.form === form.value)
            {
                setIngredientName({value: name, errorMsg: "Duplicate Ingredient"});
                return;
            }
        }

        setIngredientName({value: name, errorMsg: ''});
    }

    function handleChangeIngredientForm(e: React.ChangeEvent<HTMLInputElement>)
    {
        let form = e.target.value;
        let name = ingredientName; 
        const { error: formValidationError } = ingredientStringSchema.validate(form);

        if (formValidationError)
        {
            setIngredientForm({value: form, errorMsg: formValidationError.message});
            return;
        }

        for (let ingredient of newIngredients)
        {
            if (ingredient.name === name.value && ingredient.form === form)
            {
                setIngredientForm({value: form, errorMsg: "Duplicate Ingredient"});
                return;
            }
        }

        setIngredientForm({value: form, errorMsg: ''});
    }

    function handleChangeIngredientQuantity(e: React.ChangeEvent<HTMLInputElement>)
    {
        let quantity = parseFloat(e.target.value);

        if (e.target.value.trim() === '' || e.target.value === '.' || e.target.value === '-') 
        {
            setIngredientQuantity({ value: NaN, errorMsg: 'Quantity is required' });
        }

        const { error: quantityValidationError } = ingredientNumberSchema.validate(quantity);

        if (quantityValidationError)
        {
            setIngredientQuantity({value: quantity, errorMsg: quantityValidationError.message});
            return;
        }

        setIngredientQuantity({value: quantity, errorMsg: ''});
    }

    function handleChangeIngredientQuantityUnit(e: React.ChangeEvent<HTMLInputElement>)
    {
        let unit = e.target.value;

        const { error: unitValidationError } = ingredientStringSchema.validate(unit);

        if (unitValidationError)
        {
            setIngredientQuantityUnit({value: unit, errorMsg: unitValidationError.message});
            return;
        }

        setIngredientQuantityUnit({value: unit, errorMsg: ''});
    }

    function handleSubmit()
    {
        let ingredient: NewIngredient =
        {
            name: ingredientName.value,
            form: ingredientForm.value,
            quantity: ingredientQuantity.value,
            quantityUnit: ingredientQuantityUnit.value
        }

        const {error: ingredientValidationError} = ingredientSchema.validate(ingredient);

        if (ingredientValidationError)
        {
            console.error("Ingredient validation failed:", ingredientValidationError.message);
            setSaveError(true);
            return;
        }

        addIngredient(ingredient);

        setIngredientForm({value: '', errorMsg: ''});
        setIngredientName({value: '', errorMsg: ''});
        setIngredientQuantity({value: 1, errorMsg: ''});
        setIngredientQuantityUnit({value: '', errorMsg: ''});
        setSaveError(false); 
    }

    function handleCancel()
    {
        setIngredientForm({value: '', errorMsg: ''});
        setIngredientName({value: '', errorMsg: ''});
        setIngredientQuantity({value: 1, errorMsg: ''});
        setIngredientQuantityUnit({value: '', errorMsg: ''});
        setSaveError(false);

        cancelAddIngredient();
    }

    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2 }}>
                 <TextField
                    name="quantity"
                    label="Quantity"
                    type="number"
                    value={isNaN(ingredientQuantity.value) ? '' : ingredientQuantity.value}
                    sx={{ flex: 1 }}
                    onChange={handleChangeIngredientQuantity}
                    error={Boolean(ingredientQuantity.errorMsg)}
                    helperText={ingredientQuantity.errorMsg}
                    required
                 />
                 <TextField
                    name="quantityUnit"
                    label="Quantity Unit"
                    value={ingredientQuantityUnit.value}
                    sx={{ flex: 1 }}
                    onChange={handleChangeIngredientQuantityUnit}
                    error={Boolean(ingredientQuantityUnit.errorMsg)}
                    helperText={ingredientQuantityUnit.errorMsg}
                    required
                 />
                  <TextField
                    name="name"
                    label="Name"
                    value={ingredientName.value}
                    sx={{ flex: 1 }}
                    onChange={handleChangeIngredientName}
                    error={Boolean(ingredientName.errorMsg)}
                    helperText={ingredientName.errorMsg}
                    required
                   />
                   <TextField
                    name="form"
                    label="Form"
                    value={ingredientForm.value}
                    sx={{ flex: 1 }}
                    onChange={handleChangeIngredientForm}
                    error={Boolean(ingredientForm.errorMsg)}
                    helperText={ingredientForm.errorMsg}
                    required
                   />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                 <Button variant="outlined" color="error" onClick={handleCancel}>
                     Cancel
                 </Button>
                 <Button
                     variant="contained"
                     color="primary"
                     onClick={handleSubmit}
                     disabled={disableSaveButton}
                 >
                     Add Ingredient
                 </Button>
            </Box>
            <Snackbar open={saveError} autoHideDuration={6000} onClose={() => setSaveError(false)}>
                 <Alert
                     onClose={() => setSaveError(false)}
                     severity="error"
                     variant="outlined"
                     sx={{ width: '100%' }}
                 >
                     Failed to add ingredient. Please check inputs.
                 </Alert>
            </Snackbar>
           </Box>
       );
 }
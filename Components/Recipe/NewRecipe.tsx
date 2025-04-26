'use client'

import { useEffect, useState } from "react";
import { checkExistingRecipe } from "./actions"
import { NewIngredient } from "@/type/Recipe";
import { dietTagSchema } from "@/validation/recipeValidation";
import { ingredientsSchema } from "@/validation/ingredientValidation";
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    InputLabel,
    FormControl,
    SelectChangeEvent,
    Button,
    FormHelperText,
    List,
    ListItem,
    ListItemText as MuiListItemText,
    IconButton
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { diets } from "@/utils/lists/diets";
import NewIngredientInputs from "./NewIngredientInputs";
import { createRecipe } from "./actions";

interface Input<T>
{
    value: T
    errorMsg: string
}

export default function NewRecipe()
{
    const [recipeName, setRecipeName] = useState<Input<string>>({value: '', errorMsg: ''});
    const [dietTags, setDietTags] = useState<Input<string[]>>({value: [], errorMsg: ''});
    const [prepTimeQuantity, setPrepTimeQuantity] = useState<Input<number | ''>>({value: '', errorMsg:''});
    const [prepTimeUnit, setPrepTimeUnit] = useState<Input<string>>({value: '' , errorMsg: ''})
    const [cookTimeQuantity, setCookTimeQuantity] = useState<Input<number | ''>>({value: '', errorMsg: ''});
    const [cookTimeUnit, setCookTimeUnit] = useState<Input<string>>({value: '', errorMsg: ''})
    const [ingredients, setIngredients] = useState<Input<NewIngredient[]>>({value: [], errorMsg: ''});
    const [directions, setDirections] = useState<Input<string>>({value: '', errorMsg: ''});

    const [showAddIngredientForm, setShowAddIngredientForm] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let isFormValid = true;

        if (!recipeName.value.trim()) {
            setRecipeName(prev => ({ ...prev, errorMsg: 'Required' }));
            isFormValid = false;
        } else if (recipeName.errorMsg) {
            isFormValid = false;
        }


        const {error: dietTagValidationError} = dietTagSchema.validate(dietTags.value);
        if (dietTagValidationError) {
            setDietTags((tags) => ({...tags, errorMsg: dietTagValidationError.message}));
            isFormValid = false;
        } else {
            setDietTags((tags) => ({...tags, errorMsg: ''}));
        }

        const prepQtyNum = Number(prepTimeQuantity.value);
        if (prepTimeQuantity.value === '' || isNaN(prepQtyNum) || prepQtyNum < 0) {
            setPrepTimeQuantity(prev => ({...prev, errorMsg: 'Required and must be positive'}));
            isFormValid = false;
        } else {
            setPrepTimeQuantity(prev => ({...prev, errorMsg: ''}));
        }
        if (!prepTimeUnit.value) {
            setPrepTimeUnit(prev => ({...prev, errorMsg: 'Required'}));
            isFormValid = false;
        } else {
             setPrepTimeUnit(prev => ({...prev, errorMsg: ''}));
        }

        const cookQtyNum = Number(cookTimeQuantity.value);
        if (cookTimeQuantity.value === '' || isNaN(cookQtyNum) || cookQtyNum < 0) {
            setCookTimeQuantity(prev => ({...prev, errorMsg: 'Required and must be positive'}));
            isFormValid = false;
        } else {
             setCookTimeQuantity(prev => ({...prev, errorMsg: ''}));
        }
        if (!cookTimeUnit.value) {
            setCookTimeUnit(prev => ({...prev, errorMsg: 'Required'}));
            isFormValid = false;
        } else {
             setCookTimeUnit(prev => ({...prev, errorMsg: ''}));
        }

        const {error: ingredientValidationError} = ingredientsSchema.validate(ingredients.value);
        if (ingredientValidationError) {
            setIngredients(prev => ({...prev, errorMsg: ingredientValidationError.message || 'Please ensure all ingredients are valid and the list is not empty.'}));
            isFormValid = false;
        } else {
             setIngredients(prev => ({...prev, errorMsg: ''}));
        }

        if (!directions.value.trim()) {
            setDirections(prev => ({ ...prev, errorMsg: 'Required' }));
            isFormValid = false;
        } else {
            setDirections(prev => ({ ...prev, errorMsg: '' }));
        }

        if (isFormValid) {

            await createRecipe({
                name: recipeName.value.trim(),
                dietTags: dietTags.value,
                prepTime: String(prepTimeQuantity.value) + ' ' + prepTimeUnit.value,
                cookTime: String(cookTimeQuantity.value) + ' ' + cookTimeUnit.value,
                ingredients: ingredients.value,
                instructions: directions.value
            });

        } else {
            return;
        }
    };

    useEffect(() => {
        const handler = setTimeout(async () => {
            const currentName = recipeName.value.trim().toLowerCase();

            if (currentName) {
                const exists = await checkExistingRecipe(currentName);

                if (currentName === recipeName.value.trim().toLowerCase()) {
                    if (exists) {
                        setRecipeName((name) => ({ ...name, errorMsg: 'You already have a recipe with this name' }));
                    } else {
                        setRecipeName((name) => ({ ...name, errorMsg: '' }));
                    }
                }
            } else {
                 setRecipeName((name) => ({ ...name, errorMsg: '' }));
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [recipeName.value]);

    const handleDietTagChange = (e: SelectChangeEvent<string[]>) => {
        const values = e.target.value as string[];
        setDietTags({ value: values, errorMsg: dietTags.errorMsg });
    };

    const handlePrepTimeQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPrepTimeQuantity({ value: value === '' ? '' : Number(value), errorMsg: '' });
    };

    const handlePrepTimeUnitChange = (e: SelectChangeEvent<string>) => {
        setPrepTimeUnit({ value: e.target.value, errorMsg: '' });
    };

    const handleCookTimeQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCookTimeQuantity({ value: value === '' ? '' : Number(value), errorMsg: '' });
    };

    const handleCookTimeUnitChange = (e: SelectChangeEvent<string>) => {
        setCookTimeUnit({ value: e.target.value, errorMsg: '' });
    };

    const handleIngredientAdded = (newIngredient: NewIngredient) => {
        setIngredients(prev => ({
            value: [...prev.value, newIngredient],
            errorMsg: '',
        }));
        setShowAddIngredientForm(false);
    };

    const handleCancelAddIngredient = () => {
        setShowAddIngredientForm(false);
    };

    const handleRemoveIngredient = (indexToRemove: number) => {
        setIngredients(prev => ({
            value: prev.value.filter((_, index) => index !== indexToRemove),
            errorMsg: '',
        }));
    };

    const formatIngredient = (ingredient: NewIngredient) => {
        const parts = [];
        if (ingredient.quantity) parts.push(ingredient.quantity);
        if (ingredient.quantityUnit) parts.push(ingredient.quantityUnit);
        if (ingredient.name) parts.push(ingredient.name);
        if (ingredient.form) parts.push(`(${ingredient.form})`);
        return parts.join(' ');
    };


    return (
        <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
                New Recipe
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Recipe Name"
                    value={recipeName.value}
                    // Modified onChange to NOT clear errorMsg here
                    onChange={(e) => setRecipeName((n)=>({...n, value: e.target.value}))}
                    helperText={recipeName.errorMsg}
                    error={Boolean(recipeName.errorMsg)}
                    required
                />

                <FormControl fullWidth error={Boolean(dietTags.errorMsg)}>
                    <InputLabel id="dietTags">Diet Tags</InputLabel>
                    <Select
                        labelId="dietTags"
                        multiple
                        value={dietTags.value}
                        onChange={handleDietTagChange}
                        renderValue={(selected) => selected.join(', ')}
                        label="Diet Tags"
                    >
                        {diets.map((diet) => (
                        <MenuItem key={diet} value={diet}>
                            <Checkbox checked={dietTags.value.some(d => d === diet)} />
                            <ListItemText primary={diet} />
                        </MenuItem>
                        ))}
                    </Select>
                    {dietTags.errorMsg && <FormHelperText>{dietTags.errorMsg}</FormHelperText>}
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <TextField
                        label="Prep Time Quantity"
                        type="number"
                        value={prepTimeQuantity.value}
                        onChange={handlePrepTimeQuantityChange}
                        helperText={prepTimeQuantity.errorMsg}
                        error={Boolean(prepTimeQuantity.errorMsg)}
                        sx={{ flex: 1 }}
                        required
                        InputProps={{ inputProps: { min: 0 } }}
                    />
                    <FormControl sx={{ minWidth: 120 }} error={Boolean(prepTimeUnit.errorMsg)}>
                        <InputLabel id="prepTimeUnit">Unit *</InputLabel>
                        <Select
                            labelId="prepTimeUnit"
                            value={prepTimeUnit.value}
                            onChange={handlePrepTimeUnitChange}
                            label="Unit *"
                            required
                        >
                            <MenuItem value=""><em>Select Unit</em></MenuItem>
                            <MenuItem value="seconds">Seconds</MenuItem>
                            <MenuItem value="minutes">Minutes</MenuItem>
                            <MenuItem value="hours">Hours</MenuItem>
                            <MenuItem value="days">Days</MenuItem>
                            <MenuItem value="weeks">Weeks</MenuItem>

                        </Select>
                        {prepTimeUnit.errorMsg && <FormHelperText>{prepTimeUnit.errorMsg}</FormHelperText>}
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <TextField
                        label="Cook Time Quantity"
                        type="number"
                        value={cookTimeQuantity.value}
                        onChange={handleCookTimeQuantityChange}
                        helperText={cookTimeQuantity.errorMsg}
                        error={Boolean(cookTimeQuantity.errorMsg)}
                        sx={{ flex: 1 }}
                        required
                        InputProps={{ inputProps: { min: 0 } }}
                    />
                    <FormControl sx={{ minWidth: 120 }} error={Boolean(cookTimeUnit.errorMsg)}>
                        <InputLabel id="cookTimeUnit">Unit *</InputLabel>
                        <Select
                            labelId="cookTimeUnit"
                            value={cookTimeUnit.value}
                            onChange={handleCookTimeUnitChange}
                            label="Unit *"
                            required
                        >
                            <MenuItem value=""><em>Select Unit</em></MenuItem>
                            <MenuItem value="seconds">Seconds</MenuItem>
                            <MenuItem value="minutes">Minutes</MenuItem>
                            <MenuItem value="hours">Hours</MenuItem>
                            <MenuItem value="days">Days</MenuItem>
                            <MenuItem value="weeks">Weeks</MenuItem>
                        </Select>
                        {cookTimeUnit.errorMsg && <FormHelperText>{cookTimeUnit.errorMsg}</FormHelperText>}
                    </FormControl>
                </Box>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Ingredients</Typography>
                {ingredients.value.length > 0 ? (
                    <List dense={true}>
                        {ingredients.value.map((ingredient, index) => (
                            <ListItem
                                key={`${ingredient.name}-${ingredient.form}-${index}`}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveIngredient(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <MuiListItemText
                                    primary={formatIngredient(ingredient)}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                     <Typography variant="body2" color="textSecondary">No ingredients added yet.</Typography>
                   )}
                {ingredients.errorMsg && <Typography color="error" variant="caption">{ingredients.errorMsg}</Typography>}


                {!showAddIngredientForm && (
                     <Button
                          variant="outlined"
                          onClick={() => setShowAddIngredientForm(true)}
                          sx={{ alignSelf: 'flex-start', mt: 1 }}
                     >
                         + Add New Ingredient
                     </Button>
                   )}

                {showAddIngredientForm && (
                     <NewIngredientInputs
                          addIngredient={handleIngredientAdded}
                          cancelAddIngredient={handleCancelAddIngredient}
                          newIngredients={ingredients.value} // Pass existing ingredients if needed for validation within NewIngredientInputs
                     />
                   )}

                 <TextField
                     label="Directions"
                     multiline
                     rows={4}
                     value={directions.value}
                     onChange={(e) => setDirections({ value: e.target.value, errorMsg: '' })}
                     helperText={directions.errorMsg}
                     error={Boolean(directions.errorMsg)}
                     sx={{ mt: 2 }}
                     required
                 />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                >
                    Create Recipe
                </Button>

            </Box>
        </Box>
    );
}
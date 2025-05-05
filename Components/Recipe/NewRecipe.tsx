'use client'

import { useEffect, useState } from "react";
import { checkExistingRecipe } from "./actions"
import { NewIngredient } from "@/type/Recipe";
import { dietTagSchema, recipeNameSchema, numberSchema, timeUnitSchema } from "@/validation/recipeValidation";
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
    IconButton,
    Snackbar,
    Alert
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { diets } from "@/utils/lists/diets";
import NewIngredientInputs from "./NewIngredientInputs";
import { createRecipe } from "./actions";
import FormInput from "../Inputs/FormInput";

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
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [submitError, setSubmitError] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const recipeResponse = await createRecipe({
            name: recipeName.value.trim(),
            dietTags: dietTags.value,
            prepTime: String(prepTimeQuantity.value) + ' ' + prepTimeUnit.value,
            cookTime: String(cookTimeQuantity.value) + ' ' + cookTimeUnit.value,
            ingredients: ingredients.value,
            instructions: directions.value
        });

        if (recipeResponse.status !== 201)
            setSubmitError(true);
    };

    useEffect(() => {
        if (
                recipeName.value &&
                dietTags.value &&
                prepTimeQuantity.value &&
                prepTimeUnit.value &&
                cookTimeQuantity.value &&
                cookTimeUnit.value &&
                ingredients.value &&
                directions.value &&
                !recipeName.errorMsg &&
                !dietTags.errorMsg &&
                !prepTimeQuantity.errorMsg &&
                !prepTimeUnit.errorMsg &&
                !cookTimeQuantity.errorMsg &&
                !cookTimeUnit.errorMsg &&
                !ingredients.errorMsg &&
                !directions.errorMsg
            )
            {
                console.log(recipeName.errorMsg)
                console.log(dietTags.errorMsg)
                console.log(prepTimeQuantity.errorMsg)
                console.log(prepTimeUnit.errorMsg)
                console.log(cookTimeQuantity.errorMsg)
                console.log(cookTimeUnit.errorMsg)
                console.log(ingredients.errorMsg)
                console.log(directions.errorMsg)

                setDisableSubmit(false);
            }
        else
        {
            setDisableSubmit(true);
        }
    }, [
        recipeName, 
        dietTags, 
        prepTimeQuantity, 
        prepTimeUnit, 
        cookTimeQuantity, 
        cookTimeUnit, 
        ingredients, 
        directions
    ]);

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        const value = e.target.value.toLowerCase().trim();
        let errorMsg = '';

        const { error: nameValidationError } = recipeNameSchema.validate(value);

        if (nameValidationError)
            errorMsg = nameValidationError.message
        
        setRecipeName({value, errorMsg})
    };

    const handleDietTagChange = (e: SelectChangeEvent<string[]>) => {
        const values = e.target.value as string[];
        setDietTags({ value: values, errorMsg: dietTags.errorMsg });
    };

    const handlePrepTimeQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        let errorMsg = '';

        const { error: numberError } = numberSchema.validate(value);

        if (numberError)
            errorMsg = numberError.message;

        setPrepTimeQuantity({value, errorMsg});
    };

    const handlePrepTimeUnitChange = (e: SelectChangeEvent<string>) => {
        const value = e.target.value.toLowerCase().trim();
        let errorMsg = '';

        const { error } = timeUnitSchema.validate(value);

        if (error)
            errorMsg = error.message;

        setPrepTimeUnit({value, errorMsg})
    };

    const handleCookTimeQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        let errorMsg = '';

        const { error } = numberSchema.validate(value);

        if (error)
            errorMsg = error.message;

        setCookTimeQuantity({value, errorMsg})
    };

    const handleCookTimeUnitChange = (e: SelectChangeEvent<string>) => {
        const value = e.target.value.toLowerCase().trim();
        let errorMsg = '';

        const { error } = timeUnitSchema.validate(value);

        if (error)
            errorMsg = error.message;

        setCookTimeUnit({value, errorMsg})
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
                <FormInput
                    label="Recipe Name"
                    value={recipeName.value}
                    onChange={handleNameChange}
                    helperText={recipeName.errorMsg}
                    errorMessage={recipeName.errorMsg}
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
                        MenuProps={{
                            PaperProps: {
                            style: {
                                maxHeight: 200,
                            },
                            },
                        }}
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
                    <FormInput
                        label="Prep Time Quantity"
                        type="number"
                        value={String(prepTimeQuantity.value)}
                        onChange={handlePrepTimeQuantityChange}
                        helperText={prepTimeQuantity.errorMsg}
                        errorMessage={prepTimeQuantity.errorMsg}
                        sx={{ flex: 1 }}
                        required
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
                    <FormInput
                        label="Cook Time Quantity"
                        type="number"
                        value={String(cookTimeQuantity.value)}
                        onChange={handleCookTimeQuantityChange}
                        helperText={cookTimeQuantity.errorMsg}
                        errorMessage={cookTimeQuantity.errorMsg}
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
                    disabled={disableSubmit}
                >
                    Create Recipe
                </Button>
            </Box>
            <Snackbar
                open={submitError} 
                autoHideDuration={3000} 
                onClose={() => setSubmitError(false)}
            >
                <Alert
                    onClose={() => setSubmitError(false)}
                    severity="error"
                    variant="outlined"
                    sx={{ width: '100%' }}
                >
                    Internal Server Error
                </Alert>
            </Snackbar>
        </Box>
    );
}
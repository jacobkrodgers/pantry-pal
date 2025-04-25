import { Ingredient } from "@/type/Recipe";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Divider,
    IconButton,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { updateItem, deleteItemById } from './actions';
import { capitalize } from "@/utils/stringUtils";

interface PantryItemProps {
    ingredient: Ingredient;
    originalIngredient: Ingredient;
    setCurrentPantryItems: React.Dispatch<React.SetStateAction<Ingredient[]>>;
    onUpdate: () => void;  // Accepting onUpdate as a prop
}

export default function PantryItem({ ingredient, originalIngredient, setCurrentPantryItems, onUpdate }: PantryItemProps) {
    const [ingredientState, setIngredientState] = useState<Ingredient>(ingredient);
    const [saveError, setSaveError] = useState<boolean>(false);

    const handleItemChange = (field: keyof Ingredient, value: any) => {
        setIngredientState((prevItem) => ({
            ...prevItem,
            [field]: value,
        }));
    };

    const disableSaveCheck = () => {
        return (
            ingredientState.quantity === 0 ||
            ingredientState.quantityUnit.trim() === '' ||
            (ingredientState.quantity === originalIngredient.quantity &&
                ingredientState.quantityUnit === originalIngredient.quantityUnit)
        );
    };

    const handleSave = async () => {
        const response = await updateItem(
            ingredientState.id,
            ingredientState.quantity,
            ingredientState.quantityUnit
        );
        if (response.status !== 200 || !response.payload) {
            setSaveError(true);
        } else {
            onUpdate();  // Calling onUpdate to refresh pantry items after save
        }
    };

    const handleDeleteItem = async () => {
        await deleteItemById(ingredientState.id);
        onUpdate();  // Calling onUpdate to refresh pantry items after delete
    };

    return (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${ingredientState.id}-content`}
                        id={`panel-${ingredientState.id}-header`}
                    >
                        <Typography variant="body1">
                            {capitalize(ingredientState.form)} {capitalize(ingredientState.name)}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', pb: 2 }}>
                            <TextField
                                label="Quantity"
                                type="number"
                                value={ingredientState.quantity}
                                onChange={(e) => handleItemChange("quantity", Number(e.target.value))}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Quantity Unit"
                                value={ingredientState.quantityUnit}
                                onChange={(e) => handleItemChange("quantityUnit", e.target.value)}
                                sx={{ flex: 1 }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSave}
                                disabled={disableSaveCheck()}
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
                onClick={handleDeleteItem}
                sx={{ ml: 2 }}
            >
                <DeleteForeverIcon />
            </IconButton>

            {/* Snackbar for error */}
            <Snackbar open={saveError} autoHideDuration={3000} onClose={() => setSaveError(false)}>
                <Alert onClose={() => setSaveError(false)} severity="error" variant="outlined" sx={{ width: '100%' }}>
                    Something went wrong! Refreshing.
                </Alert>
            </Snackbar>
        </Box>
    );
}

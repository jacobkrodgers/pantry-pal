import { ListItem, ListItemText, ListItemButton, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import Tooltip from '@mui/material/Tooltip';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import { Ingredient } from '@/type/Recipe';
import unitConversion from '@/utils/dicts/unitConversion';
import { alpha } from '@mui/system';


interface IngredientListItemProps
{
    ingredient: Ingredient
    ingredientOnHand: Ingredient | undefined
    highlight: boolean
}

export default function IngredientListItem({ingredient, ingredientOnHand, highlight}: IngredientListItemProps)
{
    if (!highlight)
    {
        return (
            <ListItem sx={{ display: "flex", alignItems: "center", pl: 0 }}>
                <CircleIcon sx={{ pr: 1 }} />
                <ListItemText sx={{ display: 'list-item', pl: 1 }}>
                    <Typography>{ingredient.quantity} {ingredient.quantityUnit} {ingredient.name} {ingredient.form}</Typography>
                </ListItemText>
            </ListItem>
        )
    }

    if (!ingredientOnHand)
    {
        return (
            <ListItem sx={{ display: "flex", alignItems: "center", pl: 0, width: "fit-content" }}>
                <Tooltip title="You are missing this ingredient" placement="left-end">
                    <CancelIcon color="error" sx={{ pr: 1, fontSize: 30 }} />
                </Tooltip>
                <Tooltip title="You are missing this ingredient" placement="right-end">
                    <ListItemText sx={{ display: 'list-item', pl: 1, bgcolor: (theme) => alpha(theme.palette.error.main, 0.7), pr:1, borderRadius: 2}}>
                        <Typography>{ingredient.quantity} {ingredient.quantityUnit} {ingredient.name} {ingredient.form}</Typography>
                    </ListItemText>
                </Tooltip>
            </ListItem>
        )
    }

    if (ingredient.quantityUnit === ingredientOnHand.quantityUnit && ingredient.quantity > ingredientOnHand.quantity)
    {
        return (
            <ListItem sx={{ display: "flex", alignItems: "center", pl: 0, width: "fit-content" }}>
                <Tooltip title="You don't have enough of this ingredient" placement="left-end">
                    <RemoveCircleIcon color="warning" sx={{ pr: 1, fontSize: 30 }} />
                </Tooltip>
                <Tooltip title="You don't have enough of this ingredient" placement="right-end">
                    <ListItemText sx={{ display: 'list-item', pl: 1, bgcolor: (theme) => alpha(theme.palette.warning.main, 0.7), pr:1, borderRadius: 2}}>
                        <Typography>{ingredient.quantity} {ingredient.quantityUnit} {ingredient.name} {ingredient.form}</Typography>
                    </ListItemText>
                </Tooltip>
            </ListItem>
        )
    }

    if ((ingredient.quantityUnit !== ingredientOnHand.quantityUnit) && !(ingredient.quantityUnit in unitConversion))
    {
        return (
            <ListItem sx={{ display: "flex", alignItems: "center", pl: 0, width: "fit-content" }}>
                <Tooltip title="Incompatible unit conversion" placement="left-end">
                    <HelpIcon color="primary" sx={{ pr: 1, fontSize: 30 }} />
                </Tooltip>
                <Tooltip title="Incompatible unit conversion" placement="right-end">
                    <ListItemText sx={{ display: 'list-item', pl: 1, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.7), pr:1, borderRadius: 2}}>
                        <Typography>{ingredient.quantity} {ingredient.quantityUnit} {ingredient.name} {ingredient.form}</Typography>
                    </ListItemText>
                </Tooltip>
            </ListItem>
        )
    }
    
    if ( ingredient.quantity * unitConversion[ingredient.quantityUnit] > 
         ingredientOnHand.quantity * unitConversion[ingredientOnHand.quantityUnit]
        )
    {
        return (
            <ListItem sx={{ display: "flex", alignItems: "center", pl: 0, width: "fit-content" }}>
                <Tooltip title="You are missing this ingredient" placement="left-end">
                    <RemoveCircleIcon color="warning" sx={{ pr: 1, fontSize: 30 }} />
                </Tooltip>
                <Tooltip title="You are missing this ingredient" placement="right-end">
                    <ListItemText sx={{ display: 'list-item', pl: 1, bgcolor: (theme) => alpha(theme.palette.warning.main, 0.7), pr:1, borderRadius: 2}}>
                        <Typography>{ingredient.quantity} {ingredient.quantityUnit} {ingredient.name} {ingredient.form}</Typography>
                    </ListItemText>
                </Tooltip>
            </ListItem>
        )
    }

    return (
        <ListItem sx={{ display: "flex", alignItems: "center", pl: 0, width: "fit-content" }}>
            <Tooltip title="You have enough of this ingredient" placement="left-end">
                <CheckCircleIcon color="success" sx={{ pr: 1, fontSize: 30 }} />
            </Tooltip>
            <Tooltip title="You have enough of this ingredient" placement="right-end">
                <ListItemText sx={{ display: 'list-item', pl: 1, bgcolor: (theme) => alpha(theme.palette.success.main, 0.7), pr:1, borderRadius: 2}}>
                    <Typography>{ingredient.quantity} {ingredient.quantityUnit} {ingredient.name} {ingredient.form}</Typography>
                </ListItemText>
            </Tooltip>
        </ListItem>
    )
    
}
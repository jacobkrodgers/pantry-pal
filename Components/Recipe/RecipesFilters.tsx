'use client'

import {
    Box,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Switch,
    Typography,
    Checkbox,
    Tooltip,
    Paper,
    Collapse,
    Divider,
    Icon
} from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import StraightIcon from '@mui/icons-material/Straight';

interface RecipesFiltersProps {
    handleSearchUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
    highlight: boolean;
    toggleHighlight: () => void;
    sortBy: string;
    changeSortBy: (event: SelectChangeEvent<string>) => void;
    sortAsc: boolean;
    toggleSortAsc: () => void;
    checkboxes: {
        haveIngredients: boolean;
        lowOnIngredients: boolean;
        mightHaveIngredients: boolean;
        dontHaveIngredients: boolean;
    };
    handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RecipesFilters({
    handleSearchUpdate,
    highlight,
    toggleHighlight,
    sortBy,
    changeSortBy,
    sortAsc,
    toggleSortAsc,
    checkboxes,
    handleCheckboxChange
}: RecipesFiltersProps) 
{
    return (
        <Box sx={{ pl: 2, pr: 3, mt: 3 }}>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    pb: 2,
                }}
            >
                <TextField
                    sx={{ 
                        ml: 1, 
                        flex: 1 
                    }}
                    placeholder="Search for recipes..."
                    onChange={handleSearchUpdate}
                    variant="outlined"
                />
            </Box>
            <Box
                sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                pl: 1,
                pb: 2
                }}
            >
                <Box 
                    sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 1 
                        }}
                >
                    <FormControl 
                        sx={{ 
                                minWidth: 120 
                            }} 
                        size="small">
                        <InputLabel 
                            id="sort-by-label"
                        >
                            Sort By
                        </InputLabel>
                        <Select
                            labelId="sort-by-label"
                            id="sort-by-select"
                            value={sortBy}
                            label="Sort By"
                            onChange={changeSortBy}
                        >
                            <MenuItem 
                                value="name"
                            >
                                Name
                            </MenuItem>
                            <MenuItem 
                                value="date"
                            >
                                Date
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <IconButton 
                        onClick={toggleSortAsc} 
                        sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 0.5
                        }}
                    >
                        <Typography>
                            {sortAsc ? 'Ascending' : 'Descending'}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                            <StraightIcon
                                sx={{
                                    transform: sortAsc ? "rotate(0deg)" : "rotate(180deg)",
                                    transition: "transform 0.2s ease",
                                    mr: '-3px'
                                }}
                            />
                            <SortIcon
                                sx={{
                                    ml: '-3px'
                                }}
                            />
                        </Box>
                    </IconButton>
                </Box>
            <FormGroup>
            <FormControlLabel
                control={
                    <Switch 
                        checked={highlight} 
                        onChange={toggleHighlight} 
                    />}
                label="Filter By Ingredients"
                labelPlacement="start"
            />
            </FormGroup>
        </Box>
        <Collapse 
            in={highlight} 
            timeout="auto" 
            unmountOnExit
        >
            <Paper 
                sx={{ 
                        ml: 1, 
                        p: 2 
                    }}
            >
            <Typography 
                sx={{ pb: 1 }} 
                variant="body1"
            >
                Show recipes with:
            </Typography>
            <Divider />
            <FormGroup
                row
                sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Checkbox
                    checked={checkboxes.haveIngredients}
                    onChange={handleCheckboxChange}
                    name="haveIngredients"
                    size="small"
                />
                <Tooltip title="You have enough of this ingredient" placement="top">
                    <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
                </Tooltip>
                <Typography variant="body2">Ingredients you have</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Checkbox
                    checked={checkboxes.lowOnIngredients}
                    onChange={handleCheckboxChange}
                    name="lowOnIngredients"
                    size="small"
                />
                <Tooltip title="You don't have enough of this ingredient" placement="top">
                    <RemoveCircleIcon color="warning" sx={{ fontSize: 20 }} />
                </Tooltip>
                <Typography variant="body2">Ingredients you are low on</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Checkbox
                    checked={checkboxes.mightHaveIngredients}
                    onChange={handleCheckboxChange}
                    name="mightHaveIngredients"
                    size="small"
                />
                <Tooltip title="Incompatible unit conversion" placement="top">
                    <HelpIcon color="primary" sx={{ fontSize: 20 }} />
                </Tooltip>
                <Typography variant="body2">Ingredients you might have</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Checkbox
                    checked={checkboxes.dontHaveIngredients}
                    onChange={handleCheckboxChange}
                    name="dontHaveIngredients"
                    size="small"
                />
                <Tooltip title="You are missing this ingredient" placement="top">
                    <CancelIcon color="error" sx={{ fontSize: 20 }} />
                </Tooltip>
                <Typography variant="body2">Ingredients you don't have</Typography>
                </Box>
            </FormGroup>
            </Paper>
        </Collapse>
        </Box>
  );
}

'use client'

import NewRecipe from "@/Components/Recipe/NewRecipe"
import { Paper } from "@mui/material"

export default function Page()
{
    return (
        <Paper sx={{ m: 3, p: 2, height: '100vh' }}>
            <NewRecipe />
        </Paper>
    )
}
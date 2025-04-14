'use client'

import { DietTag } from "@/type/Recipe"
import { Box, Chip, Divider, List, Typography } from "@mui/material"
import { Link as MUILink } from '@mui/material';
import Link from 'next/link'

interface RecipeHeaderProps
{
    name: string,
    dietTags: DietTag[],
    username: string,
    created: Date,
    updated?: Date
}

export default function RecipeHeader(
    {name, dietTags, username, created, updated}: RecipeHeaderProps)
{
    return (
        <>
        <List>
            <Link href={`${username}/recipes/${name.replaceAll(" ", "%20")}`} onClick={(e) => e.stopPropagation()}>
                <Typography variant="h4" sx={{ display: 'inline', '&:hover': { color: 'primary.main' }}}>
                    {name}
                </Typography>
            </Link>
        </List>
        <List>
        <Box display="flex" flexWrap="wrap" gap={1}>
                {dietTags.map((tag, index) => (
                    <Link key={tag.name} href="test">
                        <Chip key={index} label={tag.name} size="small" onClick={(e) => e.stopPropagation()}/>
                    </Link>
                ))}
            </Box>
        </List>
        <Divider />
        <List>
        <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">
                    Author: {" "} 
                        <MUILink underline="none" component={Link} href={`users/${username}`} onClick={(e) => e.stopPropagation()}>{username}</MUILink>
                </Typography>
                <Box textAlign="right">
                    <Typography variant="caption" sx={{ display: 'block' }}>
                        Created: {created.toDateString()}
                    </Typography>
                    {
                        updated && updated > created ?

                        <Typography variant="caption" sx={{ display: 'block' }}>
                            (Updated: {updated?.toDateString()})
                        </Typography> : <></>
                    }
    
                </Box>
            </Box>
        </List>
        <Divider />
        </>
    )
}
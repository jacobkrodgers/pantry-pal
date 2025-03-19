/******************************************************************************
    SideBarToggle Component
        Purpose: Handles the side bar button to open and close the drawer.
******************************************************************************/

import { ChevronLeft, Menu } from "@mui/icons-material";
import { ListItem, ListItemButton, ListItemIcon } from "@mui/material";

export default function SideBarToggle({open, handleClick}: {open: boolean, handleClick: ()=>void}) 
{
    return (
        <ListItem key={"Side bar toggle"} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                sx={[{ minHeight: 48, justifyContent: 'center'}]}
                onClick={handleClick}
            >
                <ListItemIcon
                sx={[
                        { minWidth: 0, display: 'flex', width: '100%'},
                        { justifyContent: open ? 'flex-end' : 'center' },
                    ]}
                >
                    {open ? <ChevronLeft /> : <Menu />}
                </ListItemIcon>
            </ListItemButton>
        </ListItem>
    );
}

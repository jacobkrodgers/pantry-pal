/******************************************************************************
    SideBarItem Component
        Purpose: Represents an item in the navigation bar.

        Props: 
            open - boolean - whether or not the sidebar drawer is open
            name - string - text associated with the item
            icon - ReactNode - materialui icon component
            handleClick - function - onClick event handler function
******************************************************************************/

import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

interface SideBarItemProps
{
    open: boolean;
    name: string;
    icon: React.ReactNode;
    handleClick: () => void;
}

export default function SideBarItem
    ({ open, name, icon, handleClick}: SideBarItemProps)
{
    return (
        <ListItemButton
            sx={[
                    { minHeight: 48, px: 2.5 },
                    { justifyContent: open ? 'initial' : 'center' }
                ]}
            onClick={handleClick}
        >
            <ListItemIcon
                sx={[
                        { minWidth: 0 },
                        { justifyContent: open ? 'flex-end' : 'center' },
                        { mr: open ? 3 : 'auto' }
                    ]}
            >
                {icon}
            </ListItemIcon>
            <ListItemText
                primary={name}
                sx={[
                        { opacity: Number(open)}
                    ]}
            />
        </ListItemButton>
    );
}
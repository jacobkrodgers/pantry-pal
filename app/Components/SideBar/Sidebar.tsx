/******************************************************************************
    SideBar Component
        Purpose: Site-wide navigation bar with collapsing icons. Most of
                 this is boilerplate from MUI's Drawer example.
                 https://mui.com/material-ui/react-drawer/
******************************************************************************/

'use client'

import { useState } from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import SideBarItem from './SideBarItem';
import { useColorScheme } from '@mui/material/styles';
import { List } from '@mui/material';
import SideBarToggle from './SideBarToggle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import { DarkMode, LightMode, Restaurant } from '@mui/icons-material';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => 
({
    width: drawerWidth,
    transition: theme.transitions.create(
        'width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                 }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => 
({
    transition: theme.transitions.create(
        'width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                 }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
    }
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open'})
    (({ theme }) => 
({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
    {
        props: ({ open }) => open,
        style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
        },
    },
    {
        props: ({ open }) => !open,
        style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
        },
    },
    ],
}));

export default function SideBar({children}: Readonly<{children: React.ReactNode}>) 
{
    const [open, setOpen] = useState(true);
    const { mode, systemMode, setMode } = useColorScheme();

    const getThemeModeName = () => 
    {
        if (mode == 'dark' || systemMode == 'dark') 
        {
            return "Light Mode";
        } 
        return "Dark Mode";
    }

    const getThemeModeIcon = () => 
    {
        if (mode == 'dark' || systemMode == 'dark') 
        {
            return <LightMode />;
        } 
        return <DarkMode />;
    }

    const themeToggle = () => 
    {
        if (mode == 'dark' || systemMode == 'dark')
        {
            setMode('light');
        } 
        else 
        {
            setMode('dark');
        }
    };

    const drawerToggle = () => setOpen(!open);

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Drawer variant="permanent" open={open}>
                <List disablePadding>
                    <SideBarToggle open={open} handleClick={drawerToggle} />
                    <Divider />
                    <SideBarItem 
                        open={open} 
                        name="PantryPal" 
                        icon={<Restaurant />} 
                        handleClick={() => {}} 
                    />
                    <Divider />
                    <SideBarItem 
                        open={open} 
                        name="Profile" 
                        icon={<AccountBoxIcon />} 
                        handleClick={() => {}} 
                    />
                    <SideBarItem 
                        open={open} 
                        name="Recipes" 
                        icon={<MenuBookIcon />} 
                        handleClick={() => {}} 
                    />
                    <SideBarItem 
                        open={open} 
                        name="Following" 
                        icon={<GroupIcon />} 
                        handleClick={() => {}} 
                    />
                    <Divider />
                    <SideBarItem 
                        open={open} 
                        name={getThemeModeName()} 
                        icon={getThemeModeIcon()} 
                        handleClick={themeToggle}
                    />
                </List>
            </Drawer>
            <Box 
                component="main" 
                sx={[
                        {flexGrow: 1, p: 3, display: 'flex'}, 
                        {flexDirection: 'column'} 
                    ]}
            >
                {children}
            </Box>
        </Box>
    );
}

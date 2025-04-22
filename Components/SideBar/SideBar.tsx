/******************************************************************************
    SideBar Component
        Purpose: Site-wide navigation bar with collapsing icons and a top bar.
******************************************************************************/

'use client'

import { useState } from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import SideBarItem from './SideBarItem';
import { useColorScheme } from '@mui/material/styles';
import { List, AppBar, Toolbar, Typography, IconButton, Modal } from '@mui/material';
import SideBarToggle from './SideBarToggle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LoginIcon from '@mui/icons-material/Login';
import { AppRegistration, DarkMode, LightMode, Logout, Restaurant } from '@mui/icons-material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import Link from 'next/link';
import { PublicUser } from '@/type/User';
import PantryTabs from '../Pantry/PantryTabs';
import theme from '@/app/theme';
import { logout } from './actions';

const drawerWidth = 240;

interface SideBarProps {
    user?: PublicUser;
    children: React.ReactNode;
}

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function SideBar({ user, children }: SideBarProps) {
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const { mode, systemMode, setMode } = useColorScheme();

    const getThemeModeName = () => {
        if (mode === 'dark' || systemMode === 'dark') {
            return "Light Mode";
        }
        return "Dark Mode";
    };

    const getThemeModeIcon = () => {
        if (mode === 'dark' || systemMode === 'dark') {
            return <LightMode />;
        }
        return <DarkMode />;
    };

    const themeToggle = () => {
        if (mode === 'dark' || systemMode === 'dark') {
            setMode('light');
        } else {
            setMode('dark');
        }
    };

    const drawerToggle = () => setOpen(!open);

    const handleModalToggle = () => setModalOpen(prev => !prev);

    const handleLogout = async () => {
        await logout();
    }

    let sideBarItems;
    if (user) {
        sideBarItems = [
            <Link key="accountIcon" href={`/${user.username}`}>
                <SideBarItem open={open} name="Profile" icon={<AccountBoxIcon />} handleClick={() => {}} />
            </Link>,
            <Link key="recipesIcon" href="/recipes">
                <SideBarItem open={open} name="Recipes" icon={<MenuBookIcon />} handleClick={() => {}} />
            </Link>,
            <Divider key="div" />,
            <SideBarItem
                key="logoutIcon"
                open={open}
                name="Log Out"
                icon={<Logout />}
                handleClick={handleLogout}
            />,
        ];
    } else {
        sideBarItems = [
            <Link key="loginIcon" href="/login">
                <SideBarItem open={open} name="Login" icon={<LoginIcon />} />
            </Link>,
            <Link key="registerIcon" href="/register">
                <SideBarItem open={open} name="Create Account" icon={<AppRegistration />} />
            </Link>,
        ];
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Drawer variant="permanent" open={open}>
            <List disablePadding sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box>
                    <SideBarToggle open={open} handleClick={drawerToggle} />
                    <Divider />
                    {sideBarItems.map((item) => item)}
                </Box>
                <Box sx={{ mt: 'auto' }}>
                    <Divider />
                    <SideBarItem
                        open={open}
                        name={getThemeModeName()}
                        icon={getThemeModeIcon()}
                        handleClick={themeToggle}
                    />
                </Box>
            </List>

            </Drawer>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <AppBar 
                    position="sticky" 
                    elevation={1} 
                    sx={{ 
                        backgroundColor: theme.palette.primary.main,
                        color: "white"
                        }} 
                    enableColorOnDark
                >
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                        <Link
                            href="/"
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Restaurant sx={{ fontSize: 36, mr:1 }} />
                            <Typography
                                variant="h4"
                                noWrap
                                sx={{
                                    fontWeight: 500,
                                    fontFamily: 'Comfortaa, sans-serif',
                                    letterSpacing: 1,
                                }}
                            >
                                PantryPal
                            </Typography>
                        </Link>
                        {user && (
                            <IconButton color="inherit" onClick={handleModalToggle} sx={{ ml: 'auto' }}>
                                <KitchenIcon sx={{ fontSize: 32 }} />
                            </IconButton>
                        )}
                    </Toolbar>
                </AppBar>
                {children}
                <Modal open={modalOpen} onClose={handleModalToggle}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        minWidth: 800,
                        maxWidth: 800,
                    }}>
                        <PantryTabs />
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ProfileComponent from "@/Components/User/Profile";
import SettingsComponent from "@/Components/User/Settings";
import { Paper, Typography } from "@mui/material";
import { getUser, updatePassword, updateUsername, updateEmail, deleteUser, getRecipeCount } from "./actions"
import Settings from "@/Components/User/Settings";
import { emailValidationSchema, loginValidationSchema, usernameValidationSchema, userUpdateSchema } from "@/validation/userValidation";
import { useRouter } from "next/navigation";
import { ActionResponse } from "@/type/Generic";
import { ClientUser } from "@/type/User";
import Profile from "@/Components/User/Profile";

export default function ProfilePage() {

    const [user, setUser] = useState<ClientUser | null>(null);
    const [recipeCount, setRecipeCount] = useState(0);

    const [tab, setTab] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const userData = await getUser();

            let count;
            if (userData)
                count = await getRecipeCount(userData.id);
            
            setUser(userData);
            setRecipeCount(count ? count : 0);
        }
        
        fetchData();
    }, []);

    const handleUpdateUsername = async (username: string): Promise<ActionResponse<ClientUser>> =>
    {
        const { error } = usernameValidationSchema.validate(username);
        if(error) 
        {
            return {message: "Invalid username", status: 500}
        }

        try {
            const updatedUser = await updateUsername(username);

            if(updatedUser.status != 200) 
            {
                return {message: "Invalid username", status: 500}
            }

            setUser(updatedUser.payload!);
            return {message: 'success', status: 200, payload: updatedUser.payload}

        } 
        catch(err) 
        {
            return {message: "Invalid username", status: 500}
        }

    };
        
    const handleUpdateEmail = async (email: string): Promise<ActionResponse<ClientUser>> =>
    {
        const { error } = emailValidationSchema.validate(email)
        if(error) 
        {
            return {message: "Invalid email", status: 500}
        }

        try {
            const updatedUser = await updateEmail(email);

            if(updatedUser.status != 200) 
            {
                return {message: "Invalid email", status: 500}
            }

            setUser(updatedUser.payload!);
            return {message: 'success', status: 200, payload: updatedUser.payload}

        } 
        catch(err) 
        {
            return {message: "Invalid email", status: 500}
        }
    };
        
    const handleUpdatePassword = async (oldPassword: string, newPassword: string): Promise<ActionResponse<ClientUser>> =>
    {
        const { error } = userUpdateSchema.validate({oldPassword, newPassword});

        if(error) 
        {
            return {message: "Invalid password", status: 500}
        }

        try 
        {
            const updatedUser = await updatePassword(oldPassword, newPassword);

            if(!updatedUser) 
            {
                return {message: "Invalid password", status: 500}
            }

            return {message: "Success", status: 200}
        } 
        catch(err) 
        {
            return {message: "Invalid password", status: 500}
        }
    };
        
    const handleDeleteUser = async (username: string, password: string): Promise<ActionResponse<ClientUser>> =>
    {
        const { error } = loginValidationSchema.validate({username, password});

        if(error) 
        {
            return {message: "Invalid email", status: 500}
        }

        try {
            const deletedUser = await deleteUser(username, password);

            if(deletedUser?.status !== 200) 
            {
                return {message: "Invalid email", status: 500}
            }
            return {message: 'success', status: 200, payload: deletedUser.payload}
            
        } 
        catch(err) 
        {
            return {message: "Invalid email", status: 500}
        }
    }

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <Box sx={{ width: "100%", mt: 1 }}>
            <Tabs
                value={tab}
                onChange={handleChange}
                sx={{
                    justifyContent: "flex-start",
                    borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                }}
                TabIndicatorProps={{
                    sx: {
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: (theme) => theme.palette.primary.main,
                    },
                }}
                textColor="primary"
            >
                <Tab
                    icon={<PersonOutlineIcon />}
                    iconPosition="start"
                    label="Profile"
                    sx={{
                        textTransform: "none",
                        fontWeight: (theme) => theme.typography.fontWeightMedium,
                        fontSize: "1rem",
                        px: 2,
                    }}
                />
                <Tab
                    icon={<SettingsOutlinedIcon />}
                    iconPosition="start"
                    label="Settings"
                    sx={{
                        textTransform: "none",
                        fontWeight: (theme) => theme.typography.fontWeightMedium,
                        fontSize: "1rem",
                        px: 2,
                    }}
                />
            </Tabs>
            <Paper sx={{height: '100vh', mx: 3, mt: 3, p: 1 }}>
                {tab === 0 && 
                    (!user ? 
                        <Typography>{"Loading..."}</Typography> :
                        <Profile user={user} recipeCount={recipeCount}/>
                    )
                }
                {tab === 1 &&
                    (!user ? 
                        <Typography>{"Loading..."}</Typography> :
                        <Settings 
                            user={user} 
                            onUpdateUsername={handleUpdateUsername}
                            onUpdateEmail={handleUpdateEmail}
                            onUpdatePassword={handleUpdatePassword}
                            onDeleteUser={handleDeleteUser}
                        />
                    )
                    
                }
            </Paper>
        </Box>
    );
}

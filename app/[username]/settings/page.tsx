'use client'

import { Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ClientUser, UserControllerResponse } from "@/type/User"
import { getUser, updatePassword, updateUsername, updateEmail, deleteUser } from "./actions"
import Settings from "@/Components/User/Settings";
import { emailValidationSchema, loginValidationSchema, usernameValidationSchema, userUpdateSchema } from "@/validation/userValidation";
import { useRouter } from "next/navigation";
import { ActionResponse } from "@/type/Generic";

export default function Page() 
{
    const router = useRouter();

    const [user, setUser] = useState<ClientUser | null>(null);

    useEffect(() => {
        async function fetchData() {
            const userData = await getUser();
            setUser(userData);
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

    if(!user) {
        return <Typography>{"Loading..."}</Typography>
    }

    return (
        <Paper sx={{height: '100vh', m: 3 }}>
            <Settings 
                user={user} 
                onUpdateUsername={handleUpdateUsername}
                onUpdateEmail={handleUpdateEmail}
                onUpdatePassword={handleUpdatePassword}
                onDeleteUser={handleDeleteUser}
            />
        </Paper>
    )
}
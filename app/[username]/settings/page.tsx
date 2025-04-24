'use client'

import { Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ClientUser, UserControllerResponse } from "@/type/User"
import { getUser, updatePassword, updateUsernameOrEmail, deleteUser } from "./actions"
import UserSettings from "@/Components/User/Settings";
import { loginValidationSchema, userUpdateSchema } from "@/validation/userValidation";

export default function Page() {
    const [user, setUser] = useState<ClientUser | null>(null);
    const [error, setError] = useState<string | null>('');
    

    useEffect(() => {
        async function fetchData() {
            const userData = await getUser();
            setUser(userData);
        }

        fetchData();
    }, []);

    const handleUpdateUsernameOrEmail = useCallback(
        async (username: string, email: string) => {
            const { error } = userUpdateSchema.validate({ username, email });
            if(error) {
                setError(error.details[0].message);
            }

            try {
                const updatedUser = await updateUsernameOrEmail(username, email);

                if(!updatedUser) {
                    setError('User did not update');
                }

                setUser(updatedUser);
                setError('');
            } catch(err) {
                setError(err instanceof Error ? err.message : 'Unexpected error occurred.');
            }
        },
    []);

    const handleUpdatePassword = useCallback(
        async (oldPassword: string, newPassword: string) => {
            const { error } = userUpdateSchema.validate({oldPassword, newPassword});

            if(error) {
                setError(error.details[0].message);
            }

            try {
                const updatedUser = await updatePassword(oldPassword, newPassword);

                if(!updatedUser) {
                    setError('User did not update');
                }

                setUser(updatedUser);
                setError('');
            } catch(err) {
                setError(err instanceof Error ? err.message : 'Unexpected error occurred.')
            }
        },
    []);

    const handleDeleteUser = useCallback(
        async (username: string, password: string) => {
            const { error } = loginValidationSchema.validate({username, password});

            if(error) {
                setError(error.details[0].message);
            }

            try {
                const deletedUser = await deleteUser(username, password);

                if(deletedUser?.status !== 200) {
                    setError('User did not get deleted');
                }
                
            } catch(err) {
                setError(err instanceof Error ? err.message : 'Unexpected error occurred.')
            }
        },
    []);

    if(!user) {
        return <Typography>{error || "Loading..."}</Typography>
    }

    return (
        <Paper sx={{height: '100vh', m: 3 }}>
            <UserSettings 
                user={user} 
                onUpdateUsernameOrEmail={handleUpdateUsernameOrEmail}
                onUpdatePassword={handleUpdatePassword}
                onDeleteUser={handleDeleteUser}
            />
        </Paper>
    )
}
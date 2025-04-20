'use client'

import { Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ClientUser, UserControllerResponse } from "@/type/User"
import { getUser, updatePassword, updateUsernameOrEmail, deleteUser } from "./actions"
import UserSettings from "@/Components/User/Settings";

export default function Page() {
    const [user, setUser] = useState<ClientUser | null>(null);
    const [error, setError] = useState<string | null>(null);
    

    useEffect(() => {
        async function fetchData() {
            const userData = await getUser();
            setUser(userData);
        }

        fetchData();
    }, []);

    const handleUpdateUsernameOrEmail = useCallback(
        async (username: string, email: string) => {
            const updatedUser = await updateUsernameOrEmail(username, email);
            if(typeof(updatedUser) === 'string') {
                setError(updatedUser);
            } else {
                setUser(updatedUser);
                setError(null);
            }
        },
    []);

    const handleUpdatePassword = useCallback(
        async (oldPassword: string, newPassword: string) => {
            const updatedUser = await updatePassword(oldPassword, newPassword);
            if(typeof(updatedUser) === 'string') {
                setError(updatedUser);
            } else {
                setUser(updatedUser);
                setError(null);
            }
        },
    []);

    const handleDeleteUser = useCallback(
        async (username: string, password: string) => {
            const deletedUser = await deleteUser(username, password);
            if(typeof(deletedUser) === 'string') {
                setError(deletedUser);
            } else {
                setUser(null);
                setError(null);
            }
        },
    []);

    if(!user) {
        return <Typography>{error || "Loading..."}</Typography>
    }

    return (
        <UserSettings 
            user={user} 
            onUpdateUsernameOrEmail={handleUpdateUsernameOrEmail}
            onUpdatePassword={handleUpdatePassword}
            onDeleteUser={handleDeleteUser}
        />
    )
}
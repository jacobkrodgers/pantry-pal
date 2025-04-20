'use client'

import { Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ClientUser, UserControllerResponse } from "@/type/User"
import { useRouter } from "next/router";
import { getUser, updatePassword, updateUsernameOrEmail, deleteUser } from "./actions"
import UserSettings from "@/Components/User/Settings";

export default function Page() {
    const route = useRouter()
    const [user, setUser] = useState<ClientUser | null>(null);
    const [updatedUser, setUpdatedUser] = useState<ClientUser | UserControllerResponse>();
    

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
            if(updatedUser) {
                setUpdatedUser(updatedUser);
            }
        },
    []);

    const handleUpdatePassword = useCallback(
        async (oldPassword: string, newPassword: string) => {
            const updatedUser = await updatePassword(oldPassword, newPassword);
            if(updatedUser) {
                setUpdatedUser(updatedUser);
            }
        },
    []);

    const handleDeleteUser = useCallback(
        async (username: string, password: string) => {
            const deletedUser = await deleteUser(username, password);
            if(deletedUser) {
                setUser(null);
                route.push('/login')
            }
        },
    []);

    if(!user || !updatedUser) {
        return <Typography>Loading...</Typography>
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
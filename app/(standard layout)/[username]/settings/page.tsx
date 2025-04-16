'use client'

import { Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ClientUser } from "@/type/User"
import { getUser, updatePassword, updateUsernameOrEmail } from "./actions"
import UserSettings from "@/Components/User/Settings";

export default function Page() {
    const [user, setUser] = useState<ClientUser | null>(null);
    

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
                setUser(updatedUser);
            }
        },
    []);

    const handleUpdatePassword = useCallback(
        async (oldPassword: string, newPassword: string) => {
            const updatedUser = await updatePassword(oldPassword, newPassword);
            if(updatedUser) {
                setUser(updatedUser);
            }
        },
    []);

    if(!user) {
        return <Typography>Loading...</Typography>
    }

    return (
        <UserSettings 
            user={user} 
            onUpdateUsernameOrEmail={handleUpdateUsernameOrEmail}
            onUpdatePassword={handleUpdatePassword}
        />
    )
}
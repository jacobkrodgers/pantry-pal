'use client'

import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ClientUser } from "@/type/User"
import { getUser } from "./actions"
import { ActionResponse } from "@/type/Generic"
import UserSettings from "@/Components/User/Settings";

export default function Page() {
    const [user, setUser] = useState<ActionResponse<ClientUser> | null>(null);

    useEffect(() => {
        async function fetchData() {
            const userData = await getUser();
            setUser(userData);
        }

        fetchData();
    }, []);

    if(!user) {
        return <Typography>Loading...</Typography>
    }

    if (!user.payload) {
        return <Typography>User data is missing</Typography>
    }

    return (
        <UserSettings user={user.payload} />
    )
}
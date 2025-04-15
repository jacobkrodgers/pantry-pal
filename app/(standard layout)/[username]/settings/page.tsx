import { Typography } from "@mui/material";
import { redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { getClientUserBySessionId } from "@/controller/userController";
import UserSettings from "@/app/Components/User/UserSettings";

export default async function Page() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if(!sessionId){
        redirect(`/login`);
    }

    const user = await getClientUserBySessionId(sessionId);

    if(!user.payload) {
        return <Typography>{user.message}</Typography>
    }

    return (
        <UserSettings user={user.payload} />
    )
}
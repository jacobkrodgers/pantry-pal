'use server'

import { redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { getClientUserBySessionId,
         updateUserByApiKey,
         updateUserPasswordByApiKey } from "@/controller/userController";
import { ClientUser } from "@/type/User";


export async function getUser():
    Promise<ClientUser | null> {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if(!sessionId) {
        redirect(`/login`);
    }

    const user = await getClientUserBySessionId(sessionId);

    return user.payload ?? null;
}

export async function updateUsernameOrEmail(username: string, email: string):
    Promise<ClientUser | null> 
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if(!sessionId) {
        redirect(`/login`);
    }

    const user = await getClientUserBySessionId(sessionId);

    const userId = user.payload?.id;
    const apiKey = user.payload?.apiKey;

    if(!userId) {
        return null;
    }

    if(!apiKey) {
        return null;
    }

    const updatedUser = await updateUserByApiKey(apiKey, userId, username, email);

    return updatedUser.payload ?? null;
}

export async function updatePassword(oldPassword: string, newPassword: string):
    Promise<ClientUser | null>
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if(!sessionId) {
        redirect(`/login`);
    }

    const user = await getClientUserBySessionId(sessionId);

    const userId = user.payload?.id;
    const apiKey = user.payload?.apiKey;
    const username = user.payload?.username;
    const email = user.payload?.email;

    if(!apiKey || !userId || !username || !email) {
        return null;
    }

    const updatedUser = await updateUserPasswordByApiKey(apiKey, userId, username, email, oldPassword, newPassword);

    return updatedUser.payload ?? null;
}
'use server'

import { redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { getClientUserBySessionId,
         updateUserBySession,
         updateUserPasswordByApiKey,
         deleteUserWithSession } from "@/controller/userController";
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

    if(!userId) {
        return null;
    }

    const updatedUser = await updateUserBySession(sessionId, userId, username, email);

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
    const username = user.payload?.username;
    const email = user.payload?.email;

    if(!userId || !username || !email) {
        return null;
    }

    const updatedUser = await updateUserPasswordByApiKey(sessionId, userId, username, email, oldPassword, newPassword);

    return updatedUser.payload ?? null;
}

export async function deleteUser(username: string, password: string):
    Promise<ClientUser | null>
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if(!sessionId) {
        redirect(`/login`);
    }

    const user = await getClientUserBySessionId(sessionId);

    const userId = user.payload?.id;
    const email = user.payload?.email;

    if(!userId || !email) {
        return null;
    }

    const deletedUser = await deleteUserWithSession(sessionId, userId, username, email, password);

    return deletedUser.payload ?? null;
}
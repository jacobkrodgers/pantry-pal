'use server'

import { redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { getClientUserBySessionId,
         updateUserBySession,
         updateUserPasswordBySession,
         deleteUserWithSession } from "@/controller/userController";
import { ClientUser, UserControllerResponse } from "@/type/User";
import { loginValidationSchema, userUpdateSchema } from "@/validation/userValidation"


export async function getUser():Promise<ClientUser | null> 
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if(!sessionId) {
        redirect(`/login`);
    }

    const user = await getClientUserBySessionId(sessionId);

    return user.payload ?? null;
}

export async function updateUsernameOrEmail(username: string, email: string):
    Promise<ClientUser | string | null> 
{
    const { error } = await userUpdateSchema.validate({ username, email })

    if(error) {
        return error.details[0].message;
    }
    
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

    if(!updatedUser) {
        return null;
    }

    return updatedUser.payload ?? null;
}

export async function updatePassword(oldPassword: string, newPassword: string):
    Promise<ClientUser | string | null>
{
    const { error } = await userUpdateSchema.validate({ oldPassword, newPassword })

    if(error) {
        return error.details[0].message;
    }
    
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

    const updatedUser = await updateUserPasswordBySession(sessionId, userId, username, email, oldPassword, newPassword);

    if(!updatedUser || !updatedUser.payload) {
        return null;
    }

    return updatedUser.payload;
}

export async function deleteUser(username: string, password: string):
    Promise<ClientUser | string | null>
{
    const { error } = await loginValidationSchema.validate({ username, password })

    if(error) {
        return error.details[0].message;
    }
    
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

    if(!deletedUser) {
        return null;
    } else {
        redirect(`/login`);
        return deletedUser.payload ?? null;
    }
}
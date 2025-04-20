'use server'

import { redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { getClientUserBySessionId,
         updateUserBySession,
         updateUserPasswordBySession,
         deleteUserWithSession } from "@/controller/userController";
import { ClientUser, UserControllerResponse } from "@/type/User";
import { userUpdateSchema } from "@/validation/userValidation"


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
    Promise<ClientUser | UserControllerResponse> 
{
    const { error } = await userUpdateSchema.validate({ username, email })

    if(error) {
        return {status: 400, payload: error.details[0].message}
    }
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if(!sessionId) {
        redirect(`/login`);
    }

    const user = await getClientUserBySessionId(sessionId);

    const userId = user.payload?.id;

    if(!userId) {
        return {status: 401, payload: "Not Authorized"}
    }

    const updatedUser = await updateUserBySession(sessionId, userId, username, email);

    if(!updatedUser || !updatedUser.payload) {
        return {status: 500, payload: "Internal Server Error"}
    }

    return updatedUser.payload;
}

export async function updatePassword(oldPassword: string, newPassword: string):
    Promise<ClientUser | UserControllerResponse>
{
    const { error } = await userUpdateSchema.validate({ oldPassword, newPassword })

    if(error) {
        return {status: 400, payload: error.details[0].message}
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
        return {status: 401, payload: "Not Authorized"}
    }

    const updatedUser = await updateUserPasswordBySession(sessionId, userId, username, email, oldPassword, newPassword);

    if(!updatedUser || !updatedUser.payload) {
        return {status: 500, payload: "Internal Server Error"}
    }

    return updatedUser.payload;
}

export async function deleteUser(username: string, password: string):
    Promise<ClientUser | UserControllerResponse>
{
    const { error } = await userUpdateSchema.validate({ username, password })

    if(error) {
        return {status: 400, payload: error.details[0].message}
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
        return {status: 401, payload: "Not Authorized"}
    }

    const deletedUser = await deleteUserWithSession(sessionId, userId, username, email, password);

    if(!deletedUser || !deletedUser.payload) {
        return {status: 500, payload: "Internal Server Error"}
    }

    return {status: 200, payload: deletedUser.payload}
}
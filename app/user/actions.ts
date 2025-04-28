'use server'

import { redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { getClientUserBySessionId,
         updateUsernameBySession,
         updateEmailBySession,
         updateUserPasswordBySession,
         deleteUserWithSession } from "@/controller/userController";
import { ClientUser } from "@/type/User";
import { ActionResponse } from '@/type/Generic';
import { emailValidationSchema, loginValidationSchema, usernameValidationSchema, userUpdateSchema } from "@/validation/userValidation"
import { get_recipe_count_by_user_id } from '@/controller/recipeController';


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

export async function updateUsername(username: string):
    Promise<ActionResponse<ClientUser>> 
{
    const { error: usernameValidationError } = await usernameValidationSchema.validate(username)

    if(usernameValidationError) 
    {
        return {message: usernameValidationError.message, status: 500}
    }
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if(!sessionId)
    {
        redirect(`/login`);
    }

    const updatedUser = await updateUsernameBySession(sessionId, username);

    if(!updatedUser.payload) 
    {
        return {message: "Internal Server Error", status: 500}
    }

    return {payload: updatedUser.payload, status: 200, message: 'success'};
}

export async function updateEmail(email: string):
    Promise<ActionResponse<ClientUser>> 
{
    const { error: emailValidationError } = await emailValidationSchema.validate(email)

    if(emailValidationError) 
    {
        return {message: emailValidationError.message, status: 500}
    }
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if(!sessionId)
    {
        redirect(`/login`);
    }

    const updatedUser = await updateEmailBySession(sessionId, email);

    if(!updatedUser.payload) 
    {
        return {message: "Internal Server Error", status: 500}
    }

    return {payload: updatedUser.payload, status: 200, message: 'success'};
}

export async function updatePassword(oldPassword: string, newPassword: string):
    Promise<ClientUser | null>
{
    const { error } = await userUpdateSchema.validate({ oldPassword, newPassword })

    if(error) {
        throw new Error(error.details[0].message);
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
        throw new Error('');
    }

    const updatedUser = await updateUserPasswordBySession(sessionId, userId, username, email, oldPassword, newPassword);

    if(!updatedUser || !updatedUser.payload) {
        throw new Error('');
    }

    return updatedUser.payload;
}

export async function deleteUser(username: string, password: string):
    Promise<ActionResponse<ClientUser> | null>
{
    const { error } = await loginValidationSchema.validate({ username, password })

    if(error) {
        return { status: 401 }
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
        return { status: 404 }
    }

    const deletedUser = await deleteUserWithSession(sessionId, userId, username, email, password);

    if(!deletedUser || !deletedUser.payload) {
        return { status: 404 }
    }
    
    if(deletedUser) {
        redirect(`/login`);
    }
    return { status: 200 }
}

export async function getRecipeCount(userId: string): Promise<number> 
{
    return await get_recipe_count_by_user_id(userId);
}
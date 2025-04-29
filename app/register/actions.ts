'use server';

import { registerValidationSchema } from "@/validation/userValidation";
import { createUser, getClientUserBySessionId, loginUserWithSession } from "@/controller/userController";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Server action for registering a new user.
export async function registerUser(username: string, email: string, password: string) {
    // Server-side JOI validation 
    const { error } = registerValidationSchema.validate({ username, email, password });
    if (error) {
        return { status: 400, payload: error.details[0].message };
    }
    
    const user = await createUser(username, email, password);
    
    if (user.status === 201)
    {
        const session = await loginUserWithSession(username, password, false);

        if (session.payload)
        {
            const cookieStore = await cookies();

            cookieStore.set("session", session.payload.session.id, 
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: "lax",
                expires: session.payload.session.expiration,
            });
        }
        else
        {
            redirect(`/login`)
        }
        
        redirect(`/user`)
    }
}

export async function checkLoginAction()
{
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (!sessionId)
    {
        return;
    }
    const user = await getClientUserBySessionId(sessionId);

    if (user.payload)
    {
        redirect(`/user`)
    }
}
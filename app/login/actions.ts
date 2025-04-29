'use server';

import { loginValidationSchema } from "@/validation/userValidation";
import { getClientUserBySessionId, loginUserWithSession } from "@/controller/userController";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(username: string, password: string, keepMeLoggedIn: boolean) {
    // Server-side JOI validation 
    const { error } = loginValidationSchema.validate({ username, password });
    if (error) {
        return { status: 400, payload: error.details[0].message };
    }

    // Call the controller function that verifies credentials and creates a session record
    const result = await loginUserWithSession(username, password, keepMeLoggedIn);
    if (result.status === 201 && result.payload) {
        
        // Expect result.payload to have the shape: { user, session }
        const { session } = result.payload;
        
        const cookieStore = await cookies();
        
        cookieStore.set("session", session.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            expires: session.expiration,
        });

        redirect(`/user`)

    }
    return result;
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
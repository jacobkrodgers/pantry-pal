'use server';

import { loginValidationSchema } from "@/validation/userValidation";
import { loginUserWithSession } from "@/controller/userController";
import { cookies } from "next/headers";

export async function loginUser(username: string, password: string, keepMeLoggedIn: boolean) {
    // Server-side JOI validation 
    const { error } = loginValidationSchema.validate({ username, password });
    if (error) {
        return { status: 400, payload: error.details[0].message };
    }

    // Call the controller function that verifies credentials and creates a session record
    const result = await loginUserWithSession(username, password, keepMeLoggedIn);
    if (result.status === 201) {
        // Expect result.payload to have the shape: { user, session }
        const { session } = result.payload as { user: any; session: { id: string; expiration: Date } };
        const cookieStore = await cookies();
        cookieStore.set("session", session.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            expires: session.expiration,
        });
    }
    return result;
}

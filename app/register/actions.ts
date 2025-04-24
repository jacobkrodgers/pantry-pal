'use server';

import { registerValidationSchema } from "@/validation/userValidation";
import { createUser } from "@/controller/userController";

// Server action for registering a new user.
export async function registerUser(username: string, email: string, password: string) {
    // Server-side JOI validation 
    const { error } = registerValidationSchema.validate({ username, email, password });
    if (error) {
        return { status: 400, payload: error.details[0].message };
    }
    return await createUser(username, email, password);
}

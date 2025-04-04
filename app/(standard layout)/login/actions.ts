'use server';

import { loginValidationSchema } from "@/validation/userValidation";
import { refreshApiKey } from "@/controller/userController";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function loginUser(username: string, password: string, keepMeLoggedIn: boolean) {
  // Server-side JOI validation (final check)
  const { error } = loginValidationSchema.validate({ username, password });
  if (error) {
    return { status: 400, payload: error.details[0].message };
  }

  // Attempt to log in (refresh the API key)
  const result = await refreshApiKey(username, password);

  // On successful login, store a session ID in a cookie to track state
  if (result.status === 201) {
    // Generate a session ID using a UUID.
    const sessionId = randomUUID();
    const cookieStore = await cookies();
    
    // Calculate expiration date: 30 days if keepMeLoggedIn is true, else 24 hours
    const expires = new Date();
    if (keepMeLoggedIn) {
      expires.setDate(expires.getDate() + 30);
    } else {
      expires.setHours(expires.getHours() + 24);
    }

    cookieStore.set("session", sessionId, {
      // Prevent client-side access to the cookie
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      expires,
    });
  }
  return result;
}

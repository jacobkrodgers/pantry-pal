'use server';

import { loginValidationSchema } from "@/validation/userValidation";
import { refreshApiKey } from "@/controller/userController";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function loginUser(username: string, password: string) {
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
    cookieStore.set("session", sessionId, {
      // Prevent client-side access to the cookie
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  }
  return result;
}

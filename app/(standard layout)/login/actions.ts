'use server';

import { loginValidationSchema } from "@/validation/userValidation";
import { find_server_user_by_username, create_session } from "@/model/userModel";
import { cookies } from "next/headers";
import * as argon2 from "argon2";

export async function loginUser(username: string, password: string, keepMeLoggedIn: boolean) {
  // Server-side JOI validation 
  const { error } = loginValidationSchema.validate({ username, password });
  if (error) {
    return { status: 400, payload: error.details[0].message };
  }

  // Retrieve the user record by username
  const user = await find_server_user_by_username(username);
  if (!user) {
    return { status: 404, payload: "Not Found" };
  }

  // Validate the user's password
  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    return { status: 401, payload: "Unauthorized" };
  }

  // Calculate session expiration based on "keep me logged in" 
  const expires = new Date();
  if (keepMeLoggedIn) {
    expires.setDate(expires.getDate() + 30); // 30 days
  } else {
    expires.setHours(expires.getHours() + 24); // 24 hours
  }

  // Create a new session record in the database
  const session = await create_session(user.id, expires);
  if (!session) {
    return { status: 500, payload: "Internal Server Error - Could not create session" };
  }

  // Set the session ID in an HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set("session", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires,
  });

  return { status: 201, payload: session.id };
}

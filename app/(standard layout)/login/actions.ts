'use server';

import { loginValidationSchema } from "@/validation/userValidation";
import { refreshApiKey } from "@/controller/userController";

// Server action for logging in.
export async function loginUser(username: string, password: string) {
  // Server-side JOI validation 
  const { error } = loginValidationSchema.validate({ username, password });
  if (error) {
    return { status: 400, payload: error.details[0].message };
  }
  return await refreshApiKey(username, password);
}

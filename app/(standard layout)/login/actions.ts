'use server';

import { loginValidationSchema } from "@/validation/userValidation";
import { refreshApiKey } from "@/controller/userController";

export async function loginUser(username: string, password: string) {
  // Server-side JOI validation 
  const { error } = loginValidationSchema.validate({ username, password });
  if (error) {
    return { status: 400, payload: error.details[0].message };
  }
  const result = await refreshApiKey(username, password);
  // Check if the result is an error
  if (result.status !== 201) {
    return { status: result.status, payload: String(result.payload) };
  }
  return result;
}

'use server';

import { createUser, refreshApiKey } from "@/controller/userController";

// Login: verifies user credentials and returns a new API key
export async function loginUser(username: string, password: string) {
  return await refreshApiKey(username, password);
}

// Register: creates a new user
export async function registerUser(username: string, email: string, password: string) {
  return await createUser(username, email, password);
}

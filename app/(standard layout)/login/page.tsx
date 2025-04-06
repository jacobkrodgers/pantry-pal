"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "./actions";
import LoginForm from "@/Components/Forms/Login/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  // A callback that calls the server action and handles redirect or errors
  async function handleLogin(username: string, password: string, keepMeLoggedIn: boolean) {
    const result = await loginUser(username, password, keepMeLoggedIn);
    if (result.status === 201) {
      // If login is successful, redirect 
      router.push("/");
    } else {
      // If there's an error, return the result
      return result;
    }
  }

  return (
    <LoginForm onLogin={handleLogin} />
  );
}

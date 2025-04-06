"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "./actions";
import RegistrationForm from "@/Components/Forms/Register/RegistrationForm";

export default function RegisterPage() {
  const router = useRouter();

  // Define a callback that calls the server action.
  async function handleRegister(username: string, email: string, password: string) {
    return await registerUser(username, email, password);
  }

  return <RegistrationForm onRegister={handleRegister} />;
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "@/Components/Auth/Form";
import UsernameInput from "@/Components/Auth/UsernameInput";
import EmailInput from "@/Components/Auth/EmailInput";
import PasswordInput from "@/Components/Auth/PasswordInput";
import { registerUser } from "../auth/actions";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password1 !== password2) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const result = await registerUser(username, email, password1);
      if (result.status === 201) {
        router.push("/login");
      } else {
        alert(`Registration failed: ${result.payload}`);
      }
    } catch (error: any) {
      alert(`Error registering: ${error.message}`);
    }
  };

  return (
    <Form
      title="Sign Up"
      onSubmit={handleSubmit}
      submitLabel="Sign Up"
      inputs={[
        <UsernameInput
          key="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />,
        <EmailInput
          key="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />,
        <PasswordInput
          key="password1"
          label="Password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />,
        <PasswordInput
          key="password2"
          label="Retype Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />,
      ]}
    />
  );
}

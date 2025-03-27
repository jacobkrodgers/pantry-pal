"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Box, Typography } from "@mui/material";

import Form from "@/Components/Auth/Form";
import UsernameInput from "@/Components/Auth/UsernameInput";
import PasswordInput from "@/Components/Auth/PasswordInput";
import { loginUser } from "../auth/actions";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await loginUser(username, password);
      if (result.status === 201) {
        router.push("/");
      } else {
        alert(`Login failed: ${result.payload}`);
      }
    } catch (error: any) {
      alert(`Error logging in: ${error.message}`);
    }
  };

  return (
    <>
      {/* Reusable Form */}
      <Form
        title="Log In"
        onSubmit={handleSubmit}
        submitLabel="Log In"
        inputs={[
          <UsernameInput
            key="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />,
          <PasswordInput
            key="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />,
        ]}
      />

      {/* Link to Register Page */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="body2">
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "cyan" }}>
            Sign up here!
          </Link>
        </Typography>
      </Box>
    </>
  );
}

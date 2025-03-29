"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import FormInput from "@/Components/Inputs/FormInput";
import { loginUser } from "../../../app/(standard layout)/login/actions";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate the form inputs 
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
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Log In
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormInput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          helperText="(Letters and numbers only)"
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="(At least 8 characters, include a special character and a number)"
          inputProps={{ minLength: 8 }}
        />
        <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: "black", color: "white", ":hover": { backgroundColor: "#333" } }}>
          Log In
        </Button>
      </Box>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="body2">
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "cyan" }}>
            Sign up here!
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

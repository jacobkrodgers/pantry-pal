"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import FormInput from "@/Components/Inputs/FormInput";
import { registerUser } from "../../../app/(standard layout)/register/actions";

export default function RegistrationForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const result = await registerUser(username, email, password);
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
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormInput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          helperText="(Letters and numbers only)"
        />
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText="(Use a valid email address)"
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="(At least 8 characters, include a special character and a number)"
          inputProps={{ minLength: 8 }}
        />
        <FormInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          helperText="(Re-enter your password)"
          inputProps={{ minLength: 8 }}
        />
        <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: "black", color: "white", ":hover": { backgroundColor: "#333" } }}>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}

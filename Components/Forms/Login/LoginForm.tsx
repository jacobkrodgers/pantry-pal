"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import FormInput from "@/Components/Inputs/FormInput";
import { loginUser } from "../../../app/(standard layout)/login/actions";
import { loginValidationSchema } from "@/validation/userValidation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Error state for inputs
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error states
    setUsernameError("");
    setPasswordError("");

    // Final client-side validation using JOI 
    const { error } = loginValidationSchema.validate({ username, password });
    if (error) {
      const detail = error.details[0];
      if (detail.path.includes("username")) {
        setUsernameError(detail.message);
      }
      if (detail.path.includes("password")) {
        setPasswordError(detail.message);
      }
      return;
    }

    try {
      const result = await loginUser(username, password);
      if (result.status === 201) {
        router.push("/");
      } else {
        // Generic error message 
        setUsernameError("Not Found");
        setPasswordError("Not Found");
      }
    } catch (error: any) {
      setPasswordError(error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Log In
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormInput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          errorMessage={usernameError}
          helperText={usernameError || "(Letters and numbers only)"}
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errorMessage={passwordError}
          helperText={
            passwordError ||
            "(At least 8 characters, include a special character and a number)"
          }
          inputProps={{ minLength: 8 }}
        />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{
            backgroundColor: "black",
            color: "white",
            ":hover": { backgroundColor: "#333" },
          }}
        >
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

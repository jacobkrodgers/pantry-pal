"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import FormInput from "@/Components/Inputs/FormInput";
import { registerValidationSchema } from "@/validation/userValidation";
import { registerUser } from "../../../app/register/actions";

export default function RegistrationForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Error state for inline error messages
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Reset error states
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }

        // Client-side JOI validation
        const { error } = registerValidationSchema.validate(
            { username, email, password },
            { abortEarly: false }
        );
        if (error) {
            error.details.forEach((detail) => {
                if (detail.path.includes("username")) {
                    setUsernameError((prev) =>
                        prev ? prev + " " + detail.message : detail.message
                    );
                }
                if (detail.path.includes("email")) {
                    setEmailError((prev) =>
                        prev ? prev + " " + detail.message : detail.message
                    );
                }
                if (detail.path.includes("password")) {
                    setPasswordError((prev) =>
                        prev ? prev + " " + detail.message : detail.message
                    );
                }
            });
            return;
        }

        try {
            const result = await registerUser(username, email, password);
            if (result.status === 201) {
                router.push("/login");
            } else {
                const msg = result.payload as string;
                if (msg.toLowerCase().includes("username")) {
                    setUsernameError(msg);
                } else if (msg.toLowerCase().includes("email")) {
                    setEmailError(msg);
                } else if (msg.toLowerCase().includes("password")) {
                    setPasswordError(msg);
                } else {
                    setUsernameError(msg);
                    setEmailError(msg);
                    setPasswordError(msg);
                }
            }
        } catch (error: any) {
            setPasswordError(error.message);
        }
    }

    return (
        <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Sign Up
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
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    errorMessage={emailError}
                    helperText={emailError || "(Use a valid email address)"}
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
                    slotProps={{
                        htmlInput: { minLength: 8 },
                    }}
                />
                <FormInput
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    errorMessage={confirmPasswordError}
                    helperText={confirmPasswordError || "(Re-enter your password)"}
                    slotProps={{
                        htmlInput: { minLength: 8 },
                    }}
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
                    Sign Up
                </Button>
            </Box>
        </Box>
    );
}

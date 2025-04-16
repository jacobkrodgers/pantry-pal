"use client";

import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
} from "@mui/material";
import Link from "next/link";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FormInput from "@/Components/Inputs/FormInput";
import { loginValidationSchema } from "@/validation/userValidation";
import { loginUser } from "../../../app/(standard layout)/login/actions";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    // Local states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const handleToggleShowPassword = () => setShowPassword((prev) => !prev);

    // Error states
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Reset local errors
        setUsernameError("");
        setPasswordError("");

        // Client-side JOI validation
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
            // Call the server action directly from the client component.
            const result = await loginUser(username, password, keepMeLoggedIn);
            if (result.status === 201) {
                router.push("/");
            } else {
                // Display a generic error message for both fields.
                setUsernameError("Not Found");
                setPasswordError("Not Found");
            }
        } catch (error: any) {
            setPasswordError(error.message);
        }
    }

    return (
        <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Log In
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate // Disable native browser validation
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    errorMessage={passwordError}
                    helperText={
                        passwordError ||
                        "(At least 8 characters, include a special character and a number)"
                    }
                    // Using slotProps to forward both HTML input attributes and input adornments.
                    slotProps={{
                        htmlInput: { minLength: 8 },
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleToggleShowPassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={keepMeLoggedIn}
                            onChange={(e) => setKeepMeLoggedIn(e.target.checked)}
                        />
                    }
                    label="Keep me logged in"
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
                    Don't have an account?{" "}
                    <Link href="/register" style={{ color: "cyan" }}>
                        Sign up here!
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}

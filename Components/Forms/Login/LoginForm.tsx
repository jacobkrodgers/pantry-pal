"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Snackbar,
    Alert,
} from "@mui/material";
import Link from "next/link";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FormInput from "@/Components/Inputs/FormInput";
import { loginValidationSchema } from "@/validation/userValidation";
import { loginUser } from "../../../app/login/actions";

interface Input<T>
{
    value: T;
    errorMsg: string;
}

export default function LoginForm() {
    // Local states
    const [username, setUsername] = useState<Input<string>>({value: "", errorMsg: ""});
    const [password, setPassword] = useState<Input<string>>({value: "", errorMsg: ""});
    
    const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);

    const [disableSubmit, setDisableSubmit] = useState(true);
    const [submitError, setSubmitError] = useState(false);

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const handleToggleShowPassword = () => setShowPassword(!showPassword);

    useEffect(()=>{
        if (username.value && password.value)
            setDisableSubmit(false)
        else
            setDisableSubmit(true)
    }, [username, password])

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        const username = e.target.value;
        let errorMsg = ''

        if (!username)
            errorMsg = "Required"

        setUsername({value: username, errorMsg: errorMsg})
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        const password = e.target.value;
        let errorMsg = ''

        if (!password)
            errorMsg = "Required"

        setPassword({value: password, errorMsg: errorMsg})
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try 
        {
            // Call the server action directly from the client component.
            const result = await 
                loginUser(
                    username.value, 
                    password.value, 
                    keepMeLoggedIn);
            
            if (result.status === 201) 
            {
                return;
            } 
            else 
            {
                setSubmitError(true);
            }
        } 
        catch (error: any) 
        {
            setSubmitError(true);
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
                    value={username.value}
                    onChange={handleUsernameChange}
                    errorMessage={username.errorMsg}
                    helperText={username.errorMsg}
                />
                <FormInput
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password.value}
                    onChange={handlePasswordChange}
                    errorMessage={password.errorMsg}
                    helperText={
                        password.errorMsg
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
                    disabled={disableSubmit}
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
            <Snackbar
                open={submitError} 
                autoHideDuration={3000} 
                onClose={() => setSubmitError(false)}
            >
                <Alert
                    onClose={() => setSubmitError(false)}
                    severity="error"
                    variant="outlined"
                    sx={{ width: '100%' }}
                >
                    Internal Server Error
                </Alert>
            </Snackbar>
        </Box>
    );
}

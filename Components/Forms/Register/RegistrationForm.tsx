"use client";

import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import FormInput from "@/Components/Inputs/FormInput";
import { registerValidationSchema, usernameValidationSchema, emailValidationSchema, passwordValidationSchema } from "@/validation/userValidation";
import { registerUser } from "../../../app/register/actions";

interface Input<T>
{
    value: T;
    errorMsg: string;
}

export default function RegistrationForm() 
{
    const [username, setUsername] = useState<Input<string>>({value: "", errorMsg: ""});
    const [email, setEmail] = useState<Input<string>>({value: "", errorMsg: ""});
    const [password, setPassword] = useState<Input<string>>({value: "", errorMsg: ""});
    const [confirmPassword, setConfirmPassword] = useState<Input<string>>({value: "", errorMsg: ""});

    const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
    const [submitError, setSubmitError] = useState<boolean>(false);

    useEffect(()=>{
        if (!username.errorMsg &&
            !email.errorMsg &&
            !password.errorMsg &&
            !confirmPassword.errorMsg &&
            Boolean(username.value) &&
            Boolean(email.value) &&
            Boolean(password.value) &&
            Boolean(confirmPassword.value))
        {
            setDisableSubmit(false)
        }
    }, [username, email, password, confirmPassword])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try 
        {
            const result = await 
                registerUser(
                    username.value, 
                    email.value,
                    password.value);
            
            if (result && result.status === 201) 
            {
                redirect('/login')
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

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        const username = e.target.value;
        let errorMsg = '';

        const {error: usernameValidationError} = usernameValidationSchema.validate(username);

        if (usernameValidationError)
        {
            errorMsg = usernameValidationError.message;
        }

        setUsername({value: username, errorMsg: errorMsg});
    }

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        const email = e.target.value;
        let errorMsg = '';

        const {error: emailValidationError} = emailValidationSchema.validate(email);

        if (emailValidationError)
        {
            errorMsg = emailValidationError.message;
        }

        setEmail({value: email, errorMsg: errorMsg});
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        const password = e.target.value;
        let errorMsg = '';

        const {error: passwordValidationError} = passwordValidationSchema.validate(password);

        if (passwordValidationError)
        {
            errorMsg = passwordValidationError.message;
        }

        setPassword({value: password, errorMsg: errorMsg});
    }

    function handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        const confirmPassword = e.target.value;
        let errorMsg = '';

        if (confirmPassword !== password.value)
        {
            errorMsg = 'Passwords do not match.'
        }

        setConfirmPassword({value: confirmPassword, errorMsg: errorMsg});
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
                    value={username.value}
                    onChange={handleUsernameChange}
                    errorMessage={username.errorMsg}
                    helperText={username.errorMsg || "(Letters and numbers only)"}
                />
                <FormInput
                    label="Email"
                    type="email"
                    value={email.value}
                    onChange={handleEmailChange}
                    errorMessage={email.errorMsg}
                    helperText={email.errorMsg}
                />
                <FormInput
                    label="Password"
                    type="password"
                    value={password.value}
                    onChange={handlePasswordChange}
                    errorMessage={password.errorMsg}
                    helperText={
                        password.errorMsg ||
                        "(At least 8 characters, include a special character and a number)"
                    }
                    slotProps={{
                        htmlInput: { minLength: 8 },
                    }}
                />
                <FormInput
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword.value}
                    onChange={handleConfirmPasswordChange}
                    errorMessage={confirmPassword.errorMsg}
                    helperText={confirmPassword.errorMsg || "(Re-enter your password)"}
                    slotProps={{
                        htmlInput: { minLength: 8 },
                    }}
                />
                <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    disabled={disableSubmit}
                >
                    Sign Up
                </Button>
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
        </Box>
    );
}

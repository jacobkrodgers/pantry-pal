"use client";

import React, { useEffect } from "react";
import RegistrationForm from "@/Components/Forms/Register/RegistrationForm";
import { Paper } from "@mui/material";
import { checkLoginAction } from "./actions";

export default function RegisterPage() {

    useEffect(() => {
            async function checkLogin()
            {
                await checkLoginAction();
            }
            checkLogin();
            
        }, []);

    return (
        <Paper sx={{ m: 3, p: 2, height: '100vh' }}>
            <RegistrationForm />
        </Paper>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import LoginForm from "@/Components/Forms/Login/LoginForm";
import { Paper } from "@mui/material";
import { checkLoginAction } from "./actions";

export default function Page() {
    useEffect(() => {
        async function checkLogin()
        {
            await checkLoginAction();
        }
        checkLogin();
        
    }, []);

    return (
        <Paper sx={{ m: 3, p: 2, height: '100vh' }}>
            <LoginForm />
        </Paper>
    );
}

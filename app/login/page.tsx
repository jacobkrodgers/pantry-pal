"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/Components/Forms/Login/LoginForm";

export default function LoginPage() {
    const router = useRouter();
    const [sessionChecked, setSessionChecked] = useState(false);

    useEffect(() => {
        async function checkSession() {
            const res = await fetch("/api/session-check");
            if (res.ok) {
                const data = await res.json();
                if (data?.username) {
                    // Redirect to the user's profile using the username 
                    router.push(data.username);
                    return;
                }
            }
            setSessionChecked(true);
        }
        checkSession();
    }, [router]);

    if (!sessionChecked) return null;

    return <LoginForm />;
}

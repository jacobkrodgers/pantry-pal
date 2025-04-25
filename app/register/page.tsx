"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RegistrationForm from "@/Components/Forms/Register/RegistrationForm";

export default function RegisterPage() {
    const router = useRouter();
    const [sessionChecked, setSessionChecked] = useState(false);

    useEffect(() => {
        async function checkSession() {
            const res = await fetch("/api/session-check");
            if (res.ok) {
                const data = await res.json();
                if (data?.username) {
                    // Redirect to the user's profile 
                    router.push(data.username);
                    return;
                }
            }
            setSessionChecked(true);
        }
        checkSession();
    }, [router]);

    if (!sessionChecked) return null;

    return <RegistrationForm />;
}

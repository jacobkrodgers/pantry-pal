import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegistrationForm from "@/Components/Forms/Register/RegistrationForm";
import { getPublicUserBySessionId } from "@/controller/userController";
import { Paper } from "@mui/material";

export default async function RegisterPage() {
    // Check for an existing session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (sessionCookie) {
        const userResult = await getPublicUserBySessionId(sessionCookie);
        if (userResult.status === 200 && userResult.payload && "username" in userResult.payload) {
            // Redirect to the user's profile page if a valid session exists.
            // The URL will be "/username", where username is the user's username.
            redirect(`${userResult.payload.username}`);
        }
    }

    // Otherwise, render the client registration form
    return (
        <Paper style={{ height: '100vh', padding: 10 }}>
            <RegistrationForm />
        </Paper>
    );
}

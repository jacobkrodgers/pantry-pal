import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/Components/Forms/Login/LoginForm";
import { getPublicUserBySessionId } from "@/controller/userController";
import { loginUser } from "./actions";

export default async function LoginPage() {
  // Check for an existing session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  
  if (sessionCookie) {
    const userResult = await getPublicUserBySessionId(sessionCookie);
    if (userResult.status === 200 && userResult.payload && 'username' in userResult.payload) {
      // If a valid session exists, redirect to "/username", where username is the user's username.
      redirect(`/${userResult.payload.username}`);
    }
  }
  
  // Define the login callback to pass down to the LoginForm.
  async function handleLogin(username: string, password: string, keepMeLoggedIn: boolean) {
    return await loginUser(username, password, keepMeLoggedIn);
  }

  // Render the LoginForm with the onLogin callback.
  return <LoginForm onLogin={handleLogin} />;
}

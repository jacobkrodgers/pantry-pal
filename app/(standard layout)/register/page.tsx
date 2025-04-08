import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegistrationForm from "@/Components/Forms/Register/RegistrationForm";
import { getPublicUserBySessionId } from "@/controller/userController";
import { registerUser } from "./actions";

export default async function RegisterPage() {
  // Check for an existing session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  
  if (sessionCookie) {
    const userResult = await getPublicUserBySessionId(sessionCookie);
    if (userResult.status === 200 && userResult.payload && 'username' in userResult.payload) {
      // Redirect to the user's profile page if a valid session exists.
      // The URL will be "/username", where username is the user's username. 
      redirect(`/${userResult.payload.username}`);
    }
  }
  
  // Define the register callback to pass down to the RegistrationForm.
  async function handleRegister(username: string, email: string, password: string) {
    return await registerUser(username, email, password);
  }

  // Render the RegistrationForm with the onRegister callback.
  return <RegistrationForm onRegister={handleRegister} />;
}

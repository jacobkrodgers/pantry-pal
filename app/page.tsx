'use server'

import { getClientUserBySessionId } from "@/controller/userController";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
        const sessionId = cookieStore.get('session')?.value;
    
        if (!sessionId)
        {
            return;
        }
    
        const user = await getClientUserBySessionId(sessionId);
    
        if (user.payload)
        {
            redirect(`/user`)
        }

        redirect(`/login`)
}

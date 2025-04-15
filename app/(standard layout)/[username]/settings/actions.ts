'use server'

import { redirect } from 'next/navigation'
import { cookies } from "next/headers";
import { getClientUserBySessionId } from "@/controller/userController";


export async function getUser() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if(!sessionId) {
        redirect(`/login`);
    }

    const user = await getClientUserBySessionId(sessionId);

    return user;
}
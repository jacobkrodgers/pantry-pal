'use server'

import { getPublicUserBySessionId } from "@/controller/userController";
import { PublicUser } from "@/type/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getFollowers(page: number, followersPerPage: number):
    Promise<PublicUser[] | null>
{

    // Try to get users cookies and session ID
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // If the user doesn't have an active session, redirect to login
    if(!sessionId) {
        redirect(`login`);
    }

    const user = getPublicUserBySessionId(sessionId);
    // If the user's session has timed out, redirect to login
    if(!user) {
        redirect(`login`);
    }

    const followers = await get_followers((await user).payload?.username!, page, followersPerPage);

    return followers;
}
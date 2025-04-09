'use server'

import { getPublicUserBySessionId } from "@/controller/userController";
import { PublicUser } from "@/type/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getFollowedUsersByUsername } from "../../../controller/userController";

export async function getPeopleFollowed(page: number, peopleFollowedPerPage: number):
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

    const usersFollowed = await getFollowedUsersByUsername((await user).payload?.username!, page, peopleFollowedPerPage);

    if(usersFollowed && usersFollowed.payload) {
        return usersFollowed.payload;
    }

    return null;
}
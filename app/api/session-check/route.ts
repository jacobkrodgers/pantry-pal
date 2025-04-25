import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPublicUserBySessionId } from "@/controller/userController";

export async function GET() {
  // Read the session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  
  // If no session cookie, return a 401 response
  if (!sessionCookie) {
    return NextResponse.json({ username: null }, { status: 401 });
  }

  // Verify the session by calling controller function
  const userResult = await getPublicUserBySessionId(sessionCookie);

  if (userResult.status === 200 && userResult.payload && "username" in userResult.payload) {
    // Return the username if the session is valid
    return NextResponse.json({ username: userResult.payload.username });
  }

  return NextResponse.json({ username: null }, { status: 401 });
}

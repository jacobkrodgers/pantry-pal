import { NextRequest, NextResponse } from "next/server";
import { 
    getUserById, 
    update_user_credentials, 
    update_user_password, 
    deleteUserById 
} from "@/controller/userController";

/**
 * Middleware function for validating API keys.
 * @param req - The request object.
 * @returns Boolean indicating whether the API key is valid.
 */
function validateApiKey(req: NextRequest): boolean {
    const apiKey = req.headers.get("X-API-Key");
    return apiKey !== null && apiKey.length > 0;
}

/**
 * Route handler for GET requests made to /api/users/:id.
 * Fetches a user from the database using the provided user ID.
 * @summary Retrieves a user object by ID.
 * @param req - The request object.
 * @param params - An object containing the user ID.
 * @returns response - A response object containing the user data.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    if (!validateApiKey(req)) {
        return NextResponse.json({ message: "Unauthorized User" }, { status: 401 });
    }

    try {
        const user = await getUserById(params.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user, { status: 200 });
    } catch  {
        return NextResponse.json({ message: "Error retrieving user" }, { status: 500 });
    }
}

/**
 * Route handler for PUT requests made to /api/users/:id.
 * Updates a user's credentials in the database based on the provided user ID and request body.
 * @summary Updates an existing user.
 * @param req - The request object containing updated user data in the body.
 * @param params - An object containing the user ID.
 * @returns response - A response object containing the updated user data.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    if (!validateApiKey(req)) {
        return NextResponse.json({ message: "Unauthorized User" }, { status: 401 });
    }

    try {
        const { newUsername, newEmail, newPassword } = await req.json();
        let updatedUser = null;

        if (newUsername || newEmail) {
            updatedUser = await update_user_credentials(params.id, newUsername, newEmail);
        }
        
        if (newPassword) {
            await update_user_password(params.id, newPassword);
            updatedUser = await getUserById(params.id); // Fetch the updated user details
        }

        if (!updatedUser) {
            return NextResponse.json({ message: "User update failed" }, { status: 400 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch  {
        return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }
}

/**
 * Route handler for DELETE requests made to /api/users/:id.
 * Deletes a user from the database using the provided user ID.
 * @summary Deletes a user.
 * @param req - The request object.
 * @param params - An object containing the user ID.
 * @returns response - A response confirming successful deletion.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    if (!validateApiKey(req)) {
        return NextResponse.json({ message: "Unauthorized User" }, { status: 401 });
    }

    try {
        const user = await getUserById(params.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        
        await deleteUserById(params.id);
        return NextResponse.json({ message: "User successfully deleted" }, { status: 200 });
    } catch  {
        return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { 
    getUserByApiKey,
    updateUserCredentials, 
    updateUserPassword, 
    deleteUserByApiKey 
} from "@/controller/userController";
import { GenericAPIResponse } from "@/type/Generic";
import { UserControllerResponse } from "@/type/User";

/**
 * Middleware function for validating API keys.
 * @param req - The request object.
 * @returns The user object if API key is valid, otherwise an error response.
 */
async function validateApiKey(req: NextRequest): Promise<GenericAPIResponse> {
    const apiKey = req.headers.get("X-API-Key");
    if (!apiKey) 
        return { status: 401, payload: "Unauthorized User" };
    return await getUserByApiKey(apiKey);
}

/**
 * Route handler for GET requests made to /api/users.
 * Fetches a user from the database using the provided API key.
 */
export async function GET(req: NextRequest) {
    const response = await validateApiKey(req);
    return NextResponse.json(response.payload, { status: response.status });
}

/**
 * Route handler for PUT requests made to /api/users.
 * Updates a user's credentials or password based on the provided API key.
 */
export async function PUT(req: NextRequest) {
    const userResponse = await validateApiKey(req);
    if (userResponse.status !== 200) {
        return NextResponse.json(userResponse.payload, { status: userResponse.status });
    }

    try {
        const { newUsername, newEmail, newPassword } = await req.json();
        let updatedUser: UserControllerResponse | GenericAPIResponse = { status: 200, payload: userResponse.payload };

        if (newUsername || newEmail) {
            updatedUser = await updateUserCredentials(userResponse.payload.id, newUsername, newEmail);
        }

        if (newPassword) {
            await updateUserPassword(userResponse.payload.id, newPassword);
            updatedUser = await getUserByApiKey(req.headers.get("X-API-Key")!);
        }

        return NextResponse.json(updatedUser.payload, { status: updatedUser.status });

    } catch {
        return NextResponse.json({ message: "Bad Request - Malformed Request Body" }, { status: 400 });
    }
}

/**
 * Route handler for DELETE requests made to /api/users.
 * Deletes a user from the database using the provided API key.
 */
export async function DELETE(req: NextRequest) {
    const userResponse = await validateApiKey(req);
    if (userResponse.status !== 200) {
        return NextResponse.json(userResponse.payload, { status: userResponse.status });
    }
    
    try {
        const deleteResponse = await deleteUserByApiKey(userResponse.payload.id);
        return NextResponse.json(deleteResponse.payload, { status: deleteResponse.status });
    } catch {
        return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
    }
}
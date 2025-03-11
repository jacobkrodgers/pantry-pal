import { NextRequest, NextResponse } from "next/server";
import { 
    getUserByApiKey, 
    updateUserCredentials, 
    updateUserPassword, 
    deleteUserByApiKey,
    validateApiKey 
} from "@/controller/userController";
import { GenericAPIResponse } from "@/type/Generic";
import { UserControllerResponse} from "@/type/User";

/**
 * Route handler for GET requests made to /api/users.
 * Fetches a user from the database using the provided API key.
 */
export async function GET(req: NextRequest) 
{
    const apiKey = req.headers.get("X-API-Key");
    if (!apiKey) {
        return NextResponse.json({ message: "API key is missing" }, { status: 400 });
    }
    
    const response = await validateApiKey(apiKey);
    return NextResponse.json(response.payload, { status: response.status });
}

/**
 * Route handler for PUT requests made to /api/users.
 * Updates a user's credentials or password based on the provided API key.
 */
export async function PUT(req: NextRequest) 
{
    const apiKey = req.headers.get("X-API-Key");
    if (!apiKey) 
    {
        return NextResponse.json({ message: "API key is missing" }, { status: 400 });
    }
    
    try
    {
        const { newUsername, newEmail, newPassword } = await req.json();
        
        let updatedUser: UserControllerResponse | GenericAPIResponse = await validateApiKey(apiKey);
        if (updatedUser.status !== 200)
        {
            return NextResponse.json(updatedUser.payload, { status: updatedUser.status });
        }

        if (newUsername || newEmail)
        {
            updatedUser = await updateUserCredentials(apiKey, newUsername, newEmail);
        }
        
        if (newPassword) 
        {
            await updateUserPassword(apiKey, newPassword);
            updatedUser = await getUserByApiKey(apiKey);
        }

        return NextResponse.json(updatedUser.payload, { status: updatedUser.status });
    }
     catch
    {
        return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }
}

/**
 * Route handler for DELETE requests made to /api/users.
 * Deletes a user from the database using the provided API key.
 */
export async function DELETE(req: NextRequest) 
{
    const apiKey = req.headers.get("X-API-Key");
    if (!apiKey) 
    {
        return NextResponse.json({ message: "API key is missing" }, { status: 400 });
    }
    
    const userResponse = await validateApiKey(apiKey);
    if (userResponse.status !== 200)
    {
        return NextResponse.json(userResponse.payload, { status: userResponse.status });
    }
    
    try {
        const deleteResponse = await deleteUserByApiKey(apiKey);
        return NextResponse.json(deleteResponse.payload, { status: deleteResponse.status });
    }
     catch 
    {
        return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
    }
}

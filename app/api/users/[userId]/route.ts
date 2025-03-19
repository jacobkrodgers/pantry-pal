import { NextRequest, NextResponse } from "next/server";
import { getUserByUserId, updateUserCredentialsByApiKey, 
         updateUserPasswordByApiKey, deleteUserByApiKey, } from "@/controller/userController";
import { uuidSchema, } from "@/validation/uuidValidation";



/**
 * GET /api/users - Retrieves a user by API key.
 * @summary Fetches user details associated with the provided API key.
 * @param {NextRequest} req - The incoming request object.
 * @returns {NextResponse} - Response containing user data or an error message.
 */
export async function GET(req: Request,{params}: {params: Promise<{userId: string}>}):
 Promise<NextResponse> 
{
    try {
        // Extract API key from request headers
        let apiKey = req.headers.get("X-API-Key");
       
        if (!apiKey) {
            return NextResponse.json({message: "API key is required."}, { status: 400 });
        }
        apiKey = apiKey.trim();
         
        // Validate API key
         
        const { error: apiKeyValidationError } = uuidSchema.validate({ uuid: apiKey });
        if (apiKeyValidationError) 
        {
             return NextResponse.json("Bad Request - Invalid API Key", { status: 400 });
        }

        let userId: string;

        // Get ID from path parameters.
        try 
        {
            ({userId} = await params);
            if (!userId) throw new Error();   
        }
        catch 
        {
            return NextResponse.json("Not Found", { status: 404 });
        }

        
        // Validate that the user ID is a UUID.
        const { error: userIdValidationError } = uuidSchema.validate({ uuid: userId });
        if (userIdValidationError)
        {
            
            return NextResponse.json("Bad Request - Invalid User ID", { status: 400 });
        }

        // Step 3: Call controller function to get user data
        const response = await getUserByUserId(apiKey, userId);

        // Step 4: Return response to client
        return NextResponse.json(response.payload, { status: response.status });
    } 
    catch (error)
    {
        console.error("Error fetching user data:", error);
        return NextResponse.json({message: "Internal server error."},{ status: 500 });
    }
}
/**
 * PUT /api/users - Updates user credentials or password.
 * @summary Modifies user account details such as username, email, or password.
 * @param {NextRequest} req - The incoming request object.
 * @returns {NextResponse} - Response containing success or error message.
 */
export async function PUT(req: NextRequest): Promise<NextResponse> 
{
    try 
    {
        // Step 1: Extract API key from request headers
        let apiKey = req.headers.get("X-API-Key");
        if (!apiKey) 
        {
            return NextResponse.json({message: "API key is required."}, { status: 400 });
        }
        apiKey = apiKey.trim();

        let response;
        // Validate API key and fetch user details.
        if (!response) 
        {
            return NextResponse.json({message: "Failed to update user."},{ status: 500 });
        }

        // Step 2: Parse request body
        const { email, username, oldPassword, newPassword } = await req.json();

        // Step 3: Validate request body
        if (!email && !username && (!oldPassword || !newPassword)) 
        {
            return NextResponse.json(
                {message: "At least one field (email, username, or password) must be provided."}, { status: 400 },
            );
        }

        // Step 4: Determine whether to update credentials or password
        if (email || username) {
            response = await updateUserCredentialsByApiKey(apiKey, email, username);
        } else if (oldPassword && newPassword) {
            response = await updateUserPasswordByApiKey(apiKey, oldPassword, newPassword);
        }

        // Step 5: Return response from controller
        return NextResponse.json(response.payload, { status: response.status });

    } 
    catch (error) 
    {
        console.error("Error updating user:", error);
        return NextResponse.json({message: "Internal server error." }, { status: 500});
    }
}

/**
 * DELETE /api/users - Deletes a user by API key.
 * @summary Removes a user account permanently.
 * @param req - The request object.
 * @returns JSON confirming deletion or an error message.
 */
export async function DELETE(req: Request): Promise<NextResponse> 
{
    // Retrieve and validate API key.
    let apiKey = req.headers.get("X-API-Key");
    console.log ("Extracted API Key:", apiKey);

    if (!apiKey) 
    {   
        console.error("API Key is missing");
        return NextResponse.json({message:"Not Authorized"}, { status: 401 });
    }
    apiKey = apiKey.trim();

    const { error: apiKeyValidationError } = uuidSchema.validate({ uuid: apiKey });
    if (apiKeyValidationError) 
    {
        console.error("Invalid API Key format:", apiKey);
        return NextResponse.json({message:"Bad Request - Invalid API Key"}, { status: 400 });
    }

    
    // Extract user credentials from request body
    let requestBody;
    try {
        requestBody = await req.json();
        console.log("Parsed request body:", requestBody);
    } catch (parseError) {
        console.error("Error parsing JSON body:", parseError);
        return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }


    const { email, username, password } = requestBody;
    if (!email || !username || !password) 
    {
        console.error("Missing required fields:", { email, username, password });
        return NextResponse.json({message: "Email, username, and password are required for authentication."}, { status: 400 });
    }

    console.log("Attempting to delete user:", { apiKey, email, username });

    // Delete user from database.
    try 
    {
        
        const deleteResponse = await deleteUserByApiKey(apiKey, email, username, password);
        console.log("Delete response from database:", deleteResponse);
        return NextResponse.json(deleteResponse.payload, { status: deleteResponse.status });
    } 
    catch
    {
        console.log("Error deleting user:");
        return NextResponse.json({message: "Internal Server Error - Failed to delete user"}, { status: 500 });
    }
}

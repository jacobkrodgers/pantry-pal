import { uuidSchema } from "@/validation/uuidValidation";
import { NextResponse } from "next/server";
import { deleteUserWithApiKey, getUserByUserId, updateUserByApiKey, updateUserPasswordByApiKey } from "@/controller/userController"
import { ActionResponse, GenericAPIResponse } from "@/type/Generic";
import { ClientUser } from "@/type/User";
import { userUpdateSchema } from "@/validation/userValidation";

/**
 * GET /api/user/{userId} - Retrieves a specific user.
 * @summary Get a specific user by ID.
 * @param req - The request object.
 * @param params - An object with the user id.
 * @returns JSON with recipe data or an error message.
 */
export async function GET(req: Request, {params}: {params: Promise<{userId: string}>}):
    Promise<NextResponse> 
{
    let userId: string;

    // Get ID from path parameters.
    try 
    {
        ({userId} = await params);
        if (!userId) throw new Error();   
    }
    catch 
    {
        return NextResponse.json("Internal Server Error", { status: 500 });
    }

    // Validate that the user ID is a UUID.
    const { error: userIdValidationError } = uuidSchema.validate({ uuid: userId });
    if (userIdValidationError)
    {
        return NextResponse.json("Internal Server Error", { status: 500 });
    }

    // Get API key from request header, trim it, and validate.
    let apiKey = req.headers.get("X-API-Key");
    if (!apiKey)
    {
        return NextResponse.json("Not Authorized", { status: 401 });
    }
    apiKey = apiKey.trim();

    // Validate the API key.
    const { error: apiKeyValidationError } = uuidSchema.validate({ uuid: apiKey });
    if (apiKeyValidationError) 
    {
        return NextResponse.json("Bad Request - Invalid API Key", { status: 400 });
    }

    // Get the recipe by ID and return it.
    const userResponse = await getUserByUserId(apiKey, userId);
    return NextResponse.json(userResponse.payload, { status: userResponse.status });
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

        
        // Step 2: Parse request body
        const requestBody = await req.json();
        const {error, value} = userUpdateSchema.validate(requestBody, {abortEarly: false})     // Collect all validation errors

        if (error) 
        {
            return NextResponse.json(
                { message: "Validation error", errors: error.details.map(err => err.message) },
                { status: 400 }
            );
        }
        const { email, username, oldPassword, newPassword } = value;

        let response;
        // Validate API key and fetch user details.
        if (!response) 
        {
            return NextResponse.json({message: "Failed to update user."},{ status: 500 });
        }


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

export async function DELETE(req: Request, {params}: {params: Promise<{userId: string}>}):
    Promise<NextResponse>
{
    let userId: string;

    // Get ID from path parameters.
    try 
    {
        ({userId} = await params);
        if (!userId) throw new Error();   
    }
    catch 
    {
        console.log("1")
        return NextResponse.json("Internal Server Error", { status: 500 });
    }

    // Validate that the user ID is a UUID.
    const { error: userIdValidationError } = uuidSchema.validate({ uuid: userId });
    if (userIdValidationError)
    {
        console.log("2")
        return NextResponse.json("Internal Server Error", { status: 500 });
    }

    // Get API key from request header, trim it, and validate.
    let apiKey = req.headers.get("X-API-Key");
    if (!apiKey)
    {
        return NextResponse.json("Not Authorized", { status: 401 });
    }
    apiKey = apiKey.trim();

    // Validate the API key.
    const { error: apiKeyValidationError } = uuidSchema.validate({ uuid: apiKey });
    if (apiKeyValidationError) 
    {
        return NextResponse.json("Bad Request - Invalid API Key", { status: 400 });
    }

    // Parse update values from body
    const userData = await req.json();
    let { username, email, password } = userData;

    if (!(username && email && password))
    {
        return NextResponse.json("Bad Request", { status: 400 });
    }

    const deletedUserResponse = await 
                deleteUserWithApiKey(apiKey, userId, username, email, password);
    
    return NextResponse.json(deletedUserResponse.payload, {status: deletedUserResponse.status});
}
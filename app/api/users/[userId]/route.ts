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
 * PUT /api/user/{userId} - Updates a specific user.
 * @summary Get a specific user by ID.
 * @param req - The request object.
 * @param params - An object with the user id.
 * @returns JSON with updated user or an error message.
 */
export async function PUT(req: Request, {params}: {params: Promise<{userId: string}>})
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

    // Parse update values from body
    const userData = await req.json();
    
    //Validate the body of the request using the userUpdateSchema
    const {error: bodyValidationError, value: validatedBody} = userUpdateSchema.validate(userData, 
          { abortEarly: false});

    if (bodyValidationError)
    {
        return NextResponse.json({
            message: "validation error",
            errors: bodyValidationError.details.map(err => err.message)}, {status: 400});
    }

    let { username, email, oldPassword, newPassword } = validatedBody;
    
    // If no attributes to update, return bad request
    if (!(username || email) && !(newPassword))
    {
        return NextResponse.json
                ("Bad Request - Body must include " +
                 "attributes to update.", { status: 400 });
    }

    if (newPassword && !(username && email))
    {
        return NextResponse.json
                ("Bad Request - Password Updates Require Existing " +
                 "Username and Email as Attributes", { status: 400 });
    }

    let updatedUserResponse: ActionResponse<ClientUser> | GenericAPIResponse;
    
    // If no new password is provided, just update username and email
    // Otherwise, update the password as well
    if (!(newPassword))
    {
        updatedUserResponse = await updateUserByApiKey(apiKey, userId, username, email);
    }
    else
    {
        updatedUserResponse = await 
            updateUserPasswordByApiKey(
                apiKey, userId, username, email, 
                oldPassword, newPassword);
    }

    return NextResponse.json(updatedUserResponse.payload, {status: updatedUserResponse. status})
}

/**
 * DELETE /api/user/{userId} - Deletes a specific user.
 * @summary Get a specific user by ID.
 * @param req - The request object.
 * @param params - An object with the user id.
 * @returns JSON with deleted user status or an error message.
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
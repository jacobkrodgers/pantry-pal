import { loginValidationSchema } from "@/validation/userValidation";
import { deleteApiKeyWithCredentials, deleteApiKeyWithKey, refreshApiKey } from "@/controller/userController";
import { LoginInformation } from "@/type/User";
import { headers } from 'next/headers'
import { NextResponse } from "next/server";

/**
 * Route handler for POST requests made to /api/key. Accepts a username and password
 * from the body encoded in json. Inputs are sanitized and validated before verifying the
 * user's credentials and generating a new API key if one does not exist or deletes
 * the user's existing key and generates a new one.
 * @summary Generates or refreshes a user's API key.
 * @param req - The request object. Should contain a body with a username and password
 * encoded in json.
 * @returns response - A response object that returns a payload with the new api key if successful.
 * @returns response - A response containing an HTTP status code and error message.
 */
export async function POST(req: Request): Promise<NextResponse>
{
    let loginInfo: LoginInformation;

    // Check for malformed request body (syntax errors)
    try
    {
        loginInfo = await req.json();
    }
    catch
    {
        return NextResponse.json("Bad Request - Malformed Request Body", {status: 400});
    }

    let {username, password} = loginInfo ?? {};

    // Check if username and password are included in request body
    if (!(username && password))
    {
        return NextResponse.json("Bad Request - Missing Username or Password", {status: 400})
    };

    // Sanitize input
    username = username.trim();
    password = password.trim();

    // Ensure username and password are valid. Not strictly necessary but can save database queries.
    if (!(loginValidationSchema.validate({username: username, password: password})))
    {
        return NextResponse.json("Bad Request - Invalid Username or Password", {status: 400})
    };
    
    // Verify user and refresh token or return error
    const apiKeyResponse = await refreshApiKey(username, password);

    return NextResponse.json(apiKeyResponse.payload, {status: apiKeyResponse.status});
}

/**
 * Route handler for DELETE requests made to /api/key. Accepts a username and password
 * from the body encoded in json. Checks for an api-key in the request header and attempts to delete it.
 * If unsuccessful, uses credentials. Inputs are sanitized and validated before verifying the
 * user's credentials and deleting the user's API key if one exists.
 * @summary Generates or refreshes a user's API key.
 * @param req - Optional. The request object. Should contain a body with a username and password
 * encoded in json.
 * @returns response - A response containing an HTTP status code and message.
 */
export async function DELETE(req: Request): Promise<NextResponse>
{
    const headersList = await headers();
    const apiKey = headersList.get('X-API-Key');


    if (apiKey)
    {
        const deleteKeyResponse = await deleteApiKeyWithKey(apiKey);
        
        // Check if successful, otherwise provided API key might be stale
        if (deleteKeyResponse.status != 500)
            return NextResponse.json(deleteKeyResponse.payload, {status: deleteKeyResponse.status});
    }

    // Check if credentials were provided in the body
    let loginInfo: LoginInformation;

    // Check for malformed request body (syntax errors)
    try
    {
        loginInfo = await req.json();
    }
    catch
    {
        return NextResponse.json("Bad Request - Malformed Request Body, Missing or Stale api-key Header Value", {status: 400});
    }

    let {username, password} = loginInfo ?? {};

    // Check if username and password are included in request body
    if (!(username && password))
    {
        return NextResponse.json("Bad Request - Missing Username or Password, Missing or Stale api-key Header Value", {status: 400});
    };

    // Sanitize input
    username = username.trim();
    password = password.trim();

    const {error: loginValidationError} = 
        loginValidationSchema.validate({username: username, password: password})
    if (loginValidationError)
    {
        return NextResponse.json("Bad Request - Invalid Username or Password", {status: 400});
    };
    
    // Verify user and delete API key
    const deleteKeyResponse = await deleteApiKeyWithCredentials(username, password);

    return NextResponse.json(deleteKeyResponse.payload, {status: deleteKeyResponse.status});
}
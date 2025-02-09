import { createUser } from "@/controller/userController";
import { userValidationSchema } from "@/validation/userValidation";
import { NextRequest, NextResponse } from "next/server";

/**
 * Route handler for POST requests made to /api/users. Accepts a username, email, and password
 * from the body encoded in JSON. Inputs are validated and sanitized before creating a new user
 * and generating an API key.
 * @summary Creates a new user and returns an API key.
 * @param req - The request object. Should contain a body with username, email, and password.
 * @returns response - A response object containing the API key and user ID if successful.
 * @returns response - A response containing an HTTP status code and error message.
 */
export async function POST(req: NextRequest): Promise<NextResponse> 
{
    let userData: { username: string; email: string; password: string };
    
    // Validate and parse request body
    try 
    {
        userData = await req.json();
    } 
    catch 
    {
        return NextResponse.json({ message: "Bad Request - Malformed Request Body" }, { status: 400 });
    }
    
    const { username, email, password } = userData ?? {};
    
    // Check if all required fields are present
    if (!(username && email && password)) 
    {
        return NextResponse.json({ message: "Bad Request - Missing Required Fields" }, { status: 400 });
    }
    
    // Sanitize input
    userData.username = username.trim();
    userData.email = email.trim();
    userData.password = password.trim();
    
    // Validate input using Joi schema
    const { error } = userValidationSchema.validate(userData);
    if (error)
    {
        return NextResponse.json({ message: "Bad Request - Invalid User Data", error: error.details }, { status: 400 });
    }
    
    // Delegate user creation to the controller
    const userResponse = await createUser(userData);
    
    return NextResponse.json(userResponse.payload, { status: userResponse.status });
}

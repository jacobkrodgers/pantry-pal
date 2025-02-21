import { createUser } from "@/controller/userController";
import { registerValidationSchema } from "@/validation/userValidation";
import { NextResponse } from "next/server";

/**
 * Route handler for POST requests made to /api/users. Accepts a username, email, and password
 * from the body encoded in JSON. Inputs are validated and sanitized before creating a new user
 * and generating an API key.
 * @summary Creates a new user and returns an API key.
 * @param req - The request object. Should contain a body with username, email, and password.
 * @returns response - A response object containing the API key and user ID if successful.
 * @returns response - A response containing an HTTP status code and error message.
 */
export async function POST(req: Request): Promise<NextResponse> 
{
    let userData;
    
    // Validate and parse request body
    try 
    {
        userData = await req.json();
    } 
    catch 
    {
        return NextResponse.json({ message: "Bad Request - Malformed Request Body" }, { status: 400 });
    }
    
    let { username, email, password } = userData ?? {};
    
    // Check if all required fields are present
    if (!(username && email && password)) 
    {
        return NextResponse.json({ message: "Bad Request - Missing Required Fields" }, { status: 400 });
    }
    
    // Sanitize input
    username = username.trim();
    email = email.trim();
    password = password.trim();
    
    // Validate input using Joi schema
    const { error } = registerValidationSchema.validate({ username, email, password });
    if (error)
    {
        return NextResponse.json({ message: "Bad Request - Invalid User Data", error: error.details }, { status: 400 });
    }
    
     // Pass individual values instead of a packed object
     const userResponse = await createUser(username, email, password);
     
     // Return the response
     return NextResponse.json(userResponse.payload, { status: userResponse.status });
 
}

import * as argon2 from "argon2";
import { find_user_by_username_or_email, create_new_user, 
         find_server_user_by_username, create_or_update_api_key_by_user_id, 
         delete_api_key, delete_api_key_by_user_id, 
         get_public_user_by_session,
         get_user_by_api_key,
         get_client_user_by_id,
         update_user_by_id,
         update_user_password_by_id,
         delete_user_by_id} 
    from "@/model/userModel";
import { ActionResponse, GenericAPIResponse } from "@/type/Generic";
import { ClientUser, PublicUser, UserControllerResponse } from "@/type/User";

/**
 * Creates a new user in the database after hashing the password.
 * @summary Creates a new user.
 * @param username - The new user's username.
 * @param email - The new user's email address.
 * @param password - The new user's password.
 * @returns response - A response object that returns the user ID if successful.
 * @returns response - A response containing an HTTP status code and error message.
 */
export async function createUser(username: string, email: string, password: string):
    Promise<UserControllerResponse | GenericAPIResponse>
{
    // Check if the username or email is already taken
    const userExists = await find_user_by_username_or_email(username, email);
    if (userExists) return { status: 500, payload: "Internal Server Error" };

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Create new user in the database
    const newUser = await create_new_user(username, email, passwordHash);

    // Ensure user was successfully created
    if (!newUser) {
        return { status: 500, payload: "Internal Server Error - Failed to create user" };
    }

    return { payload: newUser, status: 201 };
}

/**
 * Verifies the user's provided credentials and deletes the user's API key (if one exists) before
 * generating a new one.
 * @summary Generates or refreshes a user's API key.
 * @param username - The user's provided username.
 * @param password - The user's provided password.
 * @returns response - A response object that returns a payload with the new api key if successful.
 * @returns response - A response containing an HTTP status code and error message.
 */
export async function refreshApiKey(username: string, password: string):
    Promise<UserControllerResponse | GenericAPIResponse>
{
    // Get database representation of the user by provided username
    const serverUser = await find_server_user_by_username(username);

    // Check if user exists in database
    if (!(serverUser))
    {
        return {status: 404, payload: "Not Found"}
    }

    // Validate user's password
    if (!(await argon2.verify(serverUser.passwordHash, password)))
    {
        return {status: 401, payload: "Unauthorized"}
    }
    
    // Refresh api key using verified user's id
    const apiKey = await create_or_update_api_key_by_user_id(serverUser.id);

    // Check if refresh was successful
    if (!(apiKey))
    {
        return {status: 500, payload: "Internal Server Error"}
    }
    
    return {status: 201, payload: apiKey}
}

/**
 * Deletes an API key when given the key itself.
 * @param apiKey - The API key to delete.
 * @returns response - A response containing an HTTP status code and message.
 */
export async function deleteApiKeyWithKey(apiKey: string):
    Promise<GenericAPIResponse>
{
    const deletedKey = await delete_api_key(apiKey);

    if (!(deletedKey))
    {
        return {status: 500, payload: "Internal Server Error"}
    }

    return {status: 200, payload: "OK"}
}

/**
 * Deletes an API key when given the user's login credentials.
 * @param username - The user's username.
 * @param password - The user's password.
 * @returns response - A response containing an HTTP status code and message.
 */
export async function deleteApiKeyWithCredentials(username: string, password: string):
    Promise<GenericAPIResponse>
{
    // Get database representation of the user by provided username
    const serverUser = await find_server_user_by_username(username);

    // Check if user exists in database
    if (!(serverUser))
    {
        return {status: 404, payload: "Not Found"}
    }

    // Validate user's password
    if (!(await argon2.verify(serverUser.passwordHash, password)))
    {
        return {status: 401, payload: "Unauthorized"}
    }

    // Delete the ApiKey using the validated user's ID
    const deletedKey = await delete_api_key_by_user_id(serverUser.id);

    // Check if record was found
    if (!(deletedKey))
    {
        return {status: 404, payload: "Not Found - No API Key Associated with Account"}
    }

    return {status: 200, payload: "OK"}
}

export async function getPublicUserBySessionId(sessionId: string):
    Promise<ActionResponse<PublicUser>>
{
    const publicUser = await get_public_user_by_session(sessionId);
    
    if (!publicUser)
    {
        return {status: 401}
    }

    return {status: 200, payload: publicUser}
}

export async function getUserByUserId(apiKey: string, userId: string):
    Promise<ActionResponse<PublicUser | ClientUser> | GenericAPIResponse>
{
    const requestingUser = await get_user_by_api_key(apiKey);

    if (!requestingUser)
    {
        return {status: 401, payload: "Not Authorized."};
    }

    let targetUser: PublicUser | ClientUser | null;

    if (requestingUser.id === userId)
    {
        targetUser = await get_client_user_by_id(userId);
    }
    else
    {
        targetUser = await get_public_user_by_session(userId);
    }

    if (!targetUser)
    {
        return {status: 500, payload: "Internal Server Error"};
    }

    return {status: 200, payload: targetUser};
}

export async function updateUserByApiKey(
    apiKey: string, userId: string, 
    username?: string, email?: string):
        Promise<ActionResponse<ClientUser> | GenericAPIResponse>
{
    const requestingUser = await get_user_by_api_key(apiKey);
    
    if (!requestingUser)
    {
        return {status: 401, payload: "Not Authorized."};
    }

    if (!(requestingUser.id === userId))
    {
        return {status: 401, payload: "Not Authorized."};
    }

    const updatedUser = await update_user_by_id(userId, username, email);

    if (!updatedUser)
    {
        return {status: 500, payload: "Internal Server Error"};
    }

    return {status: 200, payload: updatedUser};
}

export async function updateUserPasswordByApiKey(
    apiKey: string, userId: string,
    username: string, email: string,
    oldPassword: string, newPassword: string):
        Promise<ActionResponse<ClientUser> | GenericAPIResponse>
{
    const requestingUser = await get_user_by_api_key(apiKey);
    
    if (!requestingUser)
    {
        return {status: 401, payload: "Not Authorized."};
    }

    if (!(requestingUser.id === userId) || 
        !(requestingUser.username === username) ||
        !(requestingUser.email === email))
    {
        return {status: 401, payload: "Not Authorized."};
    }

    if (!(await argon2.verify(requestingUser.passwordHash, oldPassword)))
    {
        return {status: 401, payload: "Not Authorized."};
    }

    const newPasswordHash = await argon2.hash(newPassword);

    const updatedUser = await update_user_password_by_id(userId, newPasswordHash);

    if (!(updatedUser))
    {
        return {status: 500, payload: "Internal Server Error"};
    }

    return {status: 200, payload: updatedUser};
}

export async function deleteUserWithApiKey(
    apiKey: string, userId: string, username: string,
    email: string, password: string):
        Promise<ActionResponse<ClientUser> | GenericAPIResponse>
{
    const requestingUser = await get_user_by_api_key(apiKey);
    
    if (!requestingUser)
    {
        return {status: 401, payload: "Not Authorized."};
    }

    if (!(requestingUser.id === userId) || 
        !(requestingUser.username === username) ||
        !(requestingUser.email === email))
    {
        return {status: 401, payload: "Not Authorized."};
    }

    if (!(await argon2.verify(requestingUser.passwordHash, password)))
    {
        return {status: 401, payload: "Not Authorized."};
    }

    const deletedUser = await delete_user_by_id(userId);

    if (!(deletedUser))
    {
        return {status: 500, payload: "Internal Server Error"};
    }

    return {status: 200, payload: deletedUser};
}

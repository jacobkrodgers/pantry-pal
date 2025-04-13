import * as argon2 from "argon2";
import { find_user_by_username_or_email, create_new_user, create_session,
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

/**
 * Logs in a user by verifying credentials and creating a new session.
 *
 * This controller function encapsulates the entire login process:
 * - Retrieves and verifies the user's credentials.
 * - Calculates the expiration date for the session based on whether "Keep me logged in" is checked.
 * - Creates a new session record in the database using create_session.
 *
 * @param username - The username provided by the user.
 * @param password - The plaintext password provided by the user.
 * @param keepMeLoggedIn - If true, sets the session to expire in 30 days; otherwise, in 24 hours.
 * @returns On success: { status: 201, payload: { user, session } }
 *          On failure: { status: number, payload: string }
 */
export async function loginUserWithSession(
    username: string,
    password: string,
    keepMeLoggedIn: boolean
  ): Promise<UserControllerResponse | GenericAPIResponse> {
    // Retrieve the user record.
    const serverUser = await find_server_user_by_username(username);
    if (!serverUser) {
      return { status: 404, payload: "Not Found" };
    }
    // Verify the password.
    const valid = await argon2.verify(serverUser.passwordHash, password);
    if (!valid) {
      return { status: 401, payload: "Unauthorized" };
    }
  
    // Calculate session expiration.
    const expires = new Date();
    if (keepMeLoggedIn) {
      expires.setDate(expires.getDate() + 30); // 30 days.
    } else {
      expires.setHours(expires.getHours() + 24); // 24 hours.
    }
  
    // Create a new session record.
    const session = await create_session(serverUser.id, expires);
    if (!session) {
      return { status: 500, payload: "Internal Server Error - Could not create session" };
    }
  
    return { status: 201, payload: { user: serverUser, session } };
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

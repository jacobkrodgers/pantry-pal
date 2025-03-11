import * as argon2 from "argon2";
import { find_user_by_username_or_email, create_new_user, 
         find_server_user_by_username, create_or_update_api_key_by_user_id, 
         delete_api_key, delete_api_key_by_user_id,
         update_user_credentials_in_db, 
         update_user_password_in_db, 
         get_user_by_api_key, 
         delete_user_by_id } 
    from "@/model/userModel";
import { GenericAPIResponse } from "@/type/Generic";
import { UserControllerResponse} from "@/type/User";


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

/**
 * Retrieves a user by their API key.
 * @summary Fetches user data from the database.
 * @param apiKey - The user's API key.
 * @returns response - A response object containing user data if successful.
 * @returns response - A response containing an HTTP status code and error message.
 */
export async function getUserByApiKey(apiKey: string): 
    Promise<UserControllerResponse | GenericAPIResponse> 
{
    const user = await get_user_by_api_key(apiKey);
    if (!user) 
    {    
        return { status: 401, payload: "Unauthorized - Invalid API Key" };
    } 
    return { payload: user, status: 200 };
}

/**
 * Updates a user's email or username using their API key.
 * @summary Updates user credentials.
 * @param apiKey - The user's API key.
 * @param newUsername - The new username (optional).
 * @param newEmail - The new email (optional).
 * @returns response - A response object containing updated user data if successful.
 * @returns response - A response containing an HTTP status code and error message.
 */
export async function updateUserCredentials(apiKey: string, newUsername?: string, newEmail?: string): 
    Promise<UserControllerResponse | GenericAPIResponse> 
{
    const user = await get_user_by_api_key(apiKey);
    if (!user) 
    {
        return { status: 401, payload: "Unauthorized" };
    }

    const updatedUser = await update_user_credentials_in_db(user.id, newUsername, newEmail);
    if (!updatedUser) 
    {
        return { status: 400, payload: "Bad Request - User update failed" };
    }
    return { payload: updatedUser, status: 200 };
}

/**
 * Updates a user's password using their API key.
 * @summary Updates user password.
 * @param apiKey - The user's API key.
 * @param newPasswordHash - The new hashed password.
 * @returns response - A response confirming the update or an error message.
 */
export async function updateUserPassword(apiKey: string, newPasswordHash: string): 
    Promise<GenericAPIResponse> 
{
    const user = await get_user_by_api_key(apiKey);
    if (!user) 
    {
        return { status: 401, payload: "Unauthorized - Invalid API Key" };
    }
    
    await update_user_password_in_db(user.id, newPasswordHash);
    return { payload: "Password updated successfully", status: 200 };
}

/**
 * Deletes a user from the database using their API key.
 * @summary Deletes a user.
 * @param apiKey - The user's API key.
 * @returns response - A response confirming successful deletion or an error message.
 */
export async function deleteUserByApiKey(apiKey: string): 
    Promise<GenericAPIResponse> 
{
    const user = await get_user_by_api_key(apiKey);
    if (!user)
    { 
        return { status: 401, payload: "Unauthorized - Invalid API Key" };
    }
    await delete_user_by_id(user.id);
    return { payload: "User successfully deleted", status: 200 };
}

export async function validateApiKey(apiKey: string): Promise<GenericAPIResponse> {
    if (!apiKey) 
    {    
        return { status: 401, payload: "Unauthorized User" };
    }
    const user = await get_user_by_api_key(apiKey);
    if (!user) 
    {
        return { status: 404, payload: "User not found" };
    }
    return { status: 200, payload: "Valid API Key" };
}
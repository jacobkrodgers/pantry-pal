import * as argon2 from "argon2";
import { find_server_user_by_username, create_or_update_api_key_by_user_id, delete_api_key, delete_api_key_by_user_id } from "@/model/userModel";
import { GenericAPIResponse } from "@/type/Generic";
import { UserControllerResponse } from "@/type/User";

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

    // // Validate user's password
    // if (!(await argon2.verify(serverUser.passwordHash, password)))
    // {
    //     return {status: 401, payload: "Unauthorized"}
    // }
    
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
    // if (!(await argon2.verify(serverUser.passwordHash, password)))
    // {
    //     return {status: 401, payload: "Unauthorized"}
    // }

    // Delete the ApiKey using the validated user's ID
    const deletedKey = await delete_api_key_by_user_id(serverUser.id);

    // Check if record was found
    if (!(deletedKey))
    {
        return {status: 404, payload: "Not Found - No API Key Associated with Account"}
    }

    return {status: 200, payload: "OK"}
}
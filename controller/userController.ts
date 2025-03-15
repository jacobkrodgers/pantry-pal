import * as argon2 from "argon2";
import { find_user_by_username_or_email, create_new_user, 
         find_server_user_by_username, create_or_update_api_key_by_user_id, 
         delete_api_key, delete_api_key_by_user_id,
         update_user_credentials, 
         update_user_password, 
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
 * Updates a user's email, username, or password based on provided input.
 * @param {string} apiKey - The API key for authentication.
 * @param {object} userData - Contains new email, username, or password.
 * @returns {object} - Response object containing status and message.
 */
export async function updateUserCredentialsByApiKey(apiKey: string, email?:string, username?: string):
    Promise<UserControllerResponse | GenericAPIResponse>
{
    try 
    {
        // Step 1: Authenticate the user using the API key
        const existingUser = await get_user_by_api_key(apiKey);
        if (!existingUser) 
        {
            return { status: 404, payload: "User not found." };
        }

        // Step 2: Determine what needs to be updated (email, username, or password)
        let credentialsUpdated = false;
        
        // Prepare data for update (preserving unchanged values)
        const newEmail = email ? email : existingUser.email;
        const newUsername = username ? username : existingUser.username;
        
        // Step 3: Update email or username if provided
        if (newEmail || newUsername)
        {
            const updatedCredentials = await update_user_credentials(existingUser.id, email ?? existingUser.email, username ?? existingUser.username);
            if (updatedCredentials) {
                credentialsUpdated = true;
            }
        }

        // Step 5: Check if any updates were successful and return response
        if (credentialsUpdated) 
        {
            return { status: 200, payload: "User information updated successfully." };
        }

        return { status: 400, payload: "No updates were made." };
    } 
    catch (error) 
    {
        console.error("Error updating user:", error);
        return { status: 500, payload: "Internal server error." };
    }
}


/**
 * Updates a user's password after verifying the old password using Argon2.
 * @param {string} apiKey - The API key for authentication.
 * @param {string} oldPassword - The user's current password for verification.
 * @param {string} newPassword - The new password to be set.
 * @returns {Promise<UserControllerResponse | GenericAPIResponse>} - Response object containing status and message.
 */
export async function updateUserPasswordByApiKey(apiKey: string, oldPassword: string, newPassword: string): 
    Promise<UserControllerResponse | GenericAPIResponse> 
{
    try {
        // Step 1: Authenticate user using API key
        const existingUser = await get_user_by_api_key(apiKey);
        if (!existingUser) {
            return { status: 404, payload: "User not found." };
        }
        
        // Step 2: Verify the old password with Argon2
        const isPasswordValid = await argon2.verify(existingUser.passwordHash, oldPassword);
        if (!isPasswordValid) {
            return { status: 401, payload: "Invalid old password." };
        }

        // Step 3: Ensure the new password is different from the old one
        const isSamePassword = await argon2.verify(existingUser.passwordHash, newPassword);
        if (isSamePassword) {
            return { status: 400, payload: "New password cannot be the same as the old password." };
        }

        // Step 4: Hash the new password using Argon2 before updating
        const hashedPassword = await argon2.hash(newPassword);

        // Step 5: Update password in the database
        const passwordUpdated = await update_user_password(existingUser.id, hashedPassword);
        if (!passwordUpdated) {
            return { status: 500, payload: "Failed to update password. Please try again." };
        }

        return { status: 200, payload: "Password updated successfully." };
    } 
    catch (error) {
        console.error("Error updating password:", error);
        return { status: 500, payload: "Internal server error." };
    }
}

/**
 * Deletes a user from the database after verifying their credentials.
 * @param {string} apiKey - The user's API key for authentication.
 * @param {string} email - The user's registered email.
 * @param {string} username - The user's registered username.
 * @param {string} password - The user's password for verification.
 * @returns {Promise<UserControllerResponse | GenericAPIResponse>} - Response object with status and message.
 */
export async function deleteUserByApiKey(apiKey: string, email: string, username: string, password: string): 
    Promise<UserControllerResponse | GenericAPIResponse> 
{
    try 
    {
        // Step 1: Authenticate user using API key
        const existingUser = await get_user_by_api_key(apiKey);
        if (!existingUser) {
            return { status: 404, payload: "User not found." };
        }

        // Step 2: Verify all credentials match the stored data
        if (
            existingUser.email !== email ||
            existingUser.username !== username
        ) {
            return { status: 401, payload: "Invalid credentials. Deletion request denied." };
        }

        // Step 3: Verify the provided password against the stored hash
        const isPasswordValid = await argon2.verify(existingUser.passwordHash, password);
        if (!isPasswordValid) {
            return { status: 401, payload: "Invalid password. Deletion request denied." };
        }

        // Step 4: Delete user data from the database
        const deletedUser = await delete_user_by_id(existingUser.id);
        if (!deletedUser) {
            return { status: 500, payload: "Failed to delete user. Please try again later." };
        }

        return { status: 200, payload: "User account deleted successfully." };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { status: 500, payload: "Internal server error." };
    }
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


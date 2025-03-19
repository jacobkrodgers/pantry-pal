import { prisma } from "@/prisma/dbClient";
import { ServerUser, ClientUser, ApiKey } from "@/type/User";

/**
 * Checks if a user with the given username or email already exists.
 * @param username - The username to check.
 * @param email - The email to check.
 * @returns Boolean indicating whether the user exists.
 */
export async function find_user_by_username_or_email(username: string, email: string): 
    Promise<ClientUser | null>
{
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: username },
                { email: email }
            ],
        },
    });

    return user;
}


/**
 * Creates a new user in the database after hashing the password.
 * @param username - The username of the new user.
 * @param email - The email of the new user.
 * @param passwordHash - The user's hashed password.
 * @returns The created user object.
 * @returns null
 */
export async function create_new_user(username: string, email: string, passwordHash: string): 
    Promise<ClientUser | null>
{
    try
    {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
            },
            select: {
                id: true,
                email: true,
                username: true,
            }
        });

        return user;
    }
    catch
    {
        return null;
    }
}

/**
 * Queries the database for a user given their username. This function is
 * primarily for password validation as it includes the user's password hash
 * and should not be passed beyond the controller.
 * @summary Queries the database for a user given their username.
 * @param username - The user's provided username.
 * @returns ServerUser - An object representation of the complete user data stored
 * in the database. May include sensitive data such as password hashes.
 * @returns null.
 */
export async function find_server_user_by_username(username: string):
    Promise<ServerUser | null>
{
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });

    return user;
}

/**
 * Deletes the API key associated with a user.
 * @param userId - The user's id.
 * @returns deletedKey - An object representing the deleted API key.
 * @returns null.
 */
export async function delete_api_key_by_user_id(userId: string):
    Promise<ApiKey | null>
{
    try
    {
        const deletedKey = await prisma.apiKey.delete({
            where: {
                userId: userId
            }
        });

        return deletedKey;
    }
    catch
    {
        return null;
    }
   
}

/**
 * Deletes the api key.
 * @param apiKey - The key to delete.
 * @returns deletedKey - An object representing the deleted API key.
 * @returns null.
 */
export async function delete_api_key(apiKey: string):
    Promise<ApiKey | null>
{
    try
    {
        const deletedKey = await prisma.apiKey.delete({
        where: {
            apiKey: apiKey
        }
        });

        return deletedKey;
    }
    catch
    {
        return null;
    }
}

/**
 * Queries the database for an API key associated with the user. If one is found,
 * the key is deleted. A new key is generated for the user.
 * @param userId - The user's id.
 * @returns apiKey - An object representing the newly created API key
 * in the database.
 * @returns null.
 */
export async function create_or_update_api_key_by_user_id(userId: string):
    Promise<ApiKey | null>
{
    let apiKey = await prisma.apiKey.findUnique({
        where: {
            userId: userId
        }
    });

    if (apiKey) await delete_api_key_by_user_id(userId);

    apiKey = await prisma.apiKey.create({
        data:{userId: userId}
    });

    return apiKey;
}

/**
 * Gets a user from the database using a provided API Key.
 * @param apiKey - The API key to verify.
 * @returns An object representing a server user
 * @returns null
 */
export async function get_server_user_by_api_key(apiKey: string):
    Promise<ServerUser | null> 
{
    const keyMatch = await prisma.apiKey.findUnique({
        where: { apiKey: apiKey },
        include: { user: true }
    });

    return keyMatch ? keyMatch.user : null;
}

/**
 * Gets a user from the database using a provided API Key.
 * @param apiKey - The API key to verify.
 * @returns An object representing a server user
 * @returns null
 */
export async function get_client_user_by_api_key(apiKey: string):
    Promise<ClientUser | null> 
{
    const keyMatch = await prisma.apiKey.findUnique({
        where: { apiKey: apiKey },
        include: { user: { select: {
            username: true,
            email: true,
            id: true,
        }} }
    });

    const user = keyMatch ? keyMatch.user : null;
    return user;
}


/**
 * Updates a user's email and/or username in the database.
 * 
 * @param userId - The unique identifier of the user.
 * @param newUsername - The new username to update (optional).
 * @param newEmail - The new email to update (optional).
 * @returns The updated user data if successful, otherwise null.
 */
export async function update_user_credentials(userId: string, newUsername?: string, newEmail?: string) {
    try {
        // Fetch the current user details from the database
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        // If the user does not exist, return null (without revealing why)
        if (!existingUser) {
            return null; // Do not reveal if the user exists or not
        }

        // Prepare update data by keeping unchanged fields
        const updatedData = {
            username: newUsername || existingUser.username, // Retain existing username if not changed
            email: newEmail || existingUser.email          // Retain existing email if not changed
        };

        // Update user in the database with new values
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updatedData
        });

        return updatedUser;
    } catch (error) {
        console.error("Error updating user credentials:", error);
        return null; // Generic failure response
    }
}

/**
 * Updates a user's password in the database.
 * 
 * @param userId - The user's ID.
 * @param newPasswordHash - The new hashed password.
 * @returns The updated user object or null if update fails.
 */
export async function update_user_password(userId: string, newPasswordHash: string): 
    Promise<ServerUser | null> 
{
    try 
    {
        return await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash }
        });
    }
    catch 
    {
        return null;
    }
}

/**
 * Retrieves a user by their unique ID from the database.
 * 
 * @param userId - The user's ID.
 * @returns An object representing the user or null if not found.
 */
export async function find_user_by_id(userId: string): 
    Promise<ClientUser | null> 
{
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            email: true
        }
    });
}

/**
 * Deletes a user from the database.
 * 
 * @param userId - The user's ID.
 * @returns The deleted user object or null if deletion fails.
 */
export async function delete_user_by_id(userId: string): 
    Promise<ClientUser | null> 
{
    try {
        console.log("[delete_user_by_id] Attempting to delete user with ID:", userId);
        
        if (!userId) {
            console.error("❌ [delete_user_by_id] Invalid user ID provided:", userId);
            return null;
        }

        const deletedUser = await prisma.user.delete({
            where: { id: userId },
            // select: {
            //     id: true,
            //     username: true,
            //     email: true
            // }
        });

        console.log("✅ [delete_user_by_id] User successfully deleted:", deletedUser);
        return deletedUser;
    } catch (error) {
        console.error("Error deleting user:", error);

        return null;
    }
}



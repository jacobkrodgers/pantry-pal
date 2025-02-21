import { prisma } from "@/prisma/dbClient";
import { ServerUser, ApiKey } from "@/type/User";
import argon2 from "argon2";


/**
 * Checks if a user with the given username or email already exists.
 * @param username - The username to check.
 * @param email - The email to check.
 * @returns Boolean indicating whether the user exists.
 */
export async function isUserExists(username: string, email: string): Promise<boolean> {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: username },
                { email: email }
            ],
        },
    });

    return existingUser !== null;
}


/**
 * Creates a new user in the database after hashing the password.
 * @param username - The username of the new user.
 * @param email - The email of the new user.
 * @param password - The plain text password to be hashed and stored.
 * @returns The created user object.
 */
export async function createNewUser(username: string, email: string, password: string) {
    const passwordHash = await argon2.hash(password);

    return await prisma.user.create({
        data: {
            username,
            email,
            passwordHash,
        },
    });
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

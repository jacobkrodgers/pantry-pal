import { prisma } from "@/prisma/dbClient";
import { ServerUser, ClientUser, ApiKey, Session, PublicUser } from "@/type/User";

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
export async function get_user_by_api_key(apiKey: string):
    Promise<ServerUser | null> 
{
    const keyMatch = await prisma.apiKey.findUnique({
        where: { apiKey: apiKey },
        include: { user: true }
    });

    return keyMatch ? keyMatch.user : null;
}

/**
 * Creates a new user session.
 * @param userId - The user's id.
 * @param expiration - Expiration date of the session
 * @returns session - An object representing the newly created session
 * in the database.
 * @returns null.
 */
export async function create_session(userId: string, expiration: Date):
    Promise<Session | null>
{
    try
    {
        const session = await prisma.session.create({
            data:{userId, expiration}
        });
    
        return session;
    }
    catch
    {
        return null;
    }
}

/**
 * Deletes a user session.
 * @param id - The session Id to delete.
 * @returns deletedSession - An object representing the deleted session.
 * @returns null.
 */
export async function delete_session(id: string):
    Promise<Session | null>
{
    try
    {
        const deletedSession = await prisma.session.delete({
            where:
            {
                id
            }
        })
    
        return deletedSession;
    }
    catch
    {
        return null;
    }  
}

/**
 * Deletes all user sessions associated with a given user.
 * @param userId - The user's ID.
 * @returns deletedSessionCount - The number of deleted sessions.
 */
export async function delete_all_user_sessions_by_user_id(userId: string):
    Promise<number | null>
{
    const deletedSessions = await prisma.session.deleteMany({
        where:
        {
            userId
        }
    });

    return deletedSessions.count;
}

/**
 * Deletes all of a user's expired sessions.
 * @param userId - The user's ID.
 * @returns deletedSessionCount - The number of deleted sessions.
 */
export async function delete_expired_user_sessions_by_user_id(userId: string):
    Promise<number | null>
{
    const deletedSessions = await prisma.session.deleteMany({
        where:
        {
            userId,
            expiration:
            {
                lt: new Date()
            }
        }
    });

    return deletedSessions.count;
}

/**
 * Deletes all expired sessions in the database.
 * @returns deletedSessionCount - The number of deleted sessions.
 */
export async function delete_all_expired_sessions():
    Promise<number | null>
{
    const deletedSessions = await prisma.session.deleteMany({
        where:
        {
            expiration:
            {
                lt: new Date()
            }
        }
    });

    return deletedSessions.count;
}

/**
 * Gets a user from the database using a provided session.
 * @param id - The session id of the user.
 * @returns An object representing a server user
 * @returns null
 */
export async function get_public_user_by_session(id: string):
    Promise<PublicUser | null>
{
    const session = await prisma.session.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    });

    return session ? session.user : null;
}

export async function get_public_user_by_id(id: string):
    Promise<PublicUser | null>
{
    const user = await prisma.user.findUnique({
        where: {id},
        select: {
            id: true,
            username: true
        }
    })

    return user;
}

/**
 * Gets a user from the database using a provided session.
 * @param id - The session id of the user.
 * @returns An object representing a client user
 * @returns null
 */
export async function get_client_user_by_session(id: string):
    Promise<ClientUser | null>
{
    const session = await prisma.session.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            },
        },
    });

    return session ? session.user : null;
}
/*
export async function get_people_followed_by_user_id(userId: string, page: number, peopleFollowedPerPage: number):
    Promise<PublicUser[] | null>
{
    const followedUsers = await prisma.followedUser.findMany({
        where: { userId },
        select: {
            user: true
        },
        skip: page * peopleFollowedPerPage,
        take: peopleFollowedPerPage * 5,
    });

    return followedUsers.length > 0
        ? followedUsers.map(followedUser => {
            const user = followedUser.user;
            return {
                id: user.id,
                email: user.email,
                username: user.username,
                passwordHash: user.passwordHash,
                // Add any additional properties here if needed
            } as PublicUser; // Ensure the shape matches the PublicUser type
        })
        : [];
}

export async function add_person_to_followed_by_user_id(userId: string, followedUserId: string):
    Promise<PublicUser | null>
{
    try
    {
        const existingFollow = await prisma.followedUser.findUnique({
            where: {
                userId,
                id: followedUserId
            }
        });

        if(existingFollow)
        {
            return null;
        }

        const newFollowedUser = await prisma.followedUser.create({
            data: {userId, id: followedUserId}
        });

        if(!newFollowedUser)
        {
            return null;
        }

        return newFollowedUser;
    }
    catch
    {
        return null;
    }
}

export async function delete_person_from_followed_by_user_id(userId: string, followedUserId: string):
    Promise<PublicUser | null>
{
    try
    {
        const followedUser = await prisma.user.findUnique({
            where: {id: followedUserId}
        });

        if(!followedUser)
        {
            return null;
        }

        const deletedFollowedUser = await prisma.followedUser.delete({
            where: {
                userId,
                id: followedUserId
            }
        });

        return deletedFollowedUser;
    }
    catch
    {
        return null;
    }
}
*/
export async function get_client_user_by_id(id: string):
    Promise<ClientUser | null>
{
    const user = await prisma.user.findUnique({
        where: {id},
        select: {
            id: true,
            username: true,
            email: true
        }
    })

    return user;
}

export async function update_user_by_id(id: string, username?: string, email?: string):
    Promise<ClientUser | null>
{
    try
    {
        const existingUser = await prisma.user.findUnique({
            where: {id}
        })
    
        if (!existingUser) return null;
    
        const updatedUser = await prisma.user.update({
            where: {id},
            data: {
                username: username ?? existingUser.username,
                email: email ?? existingUser.email
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        })
    
        return updatedUser;
    }
    catch
    {
        return null;
    }
}

export async function update_user_password_by_id(id: string, passwordHash: string):
    Promise<ClientUser | null>
{
    try
    {
        const updatedUser = await prisma.user.update({
            where: {id},
            data: {
                passwordHash
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        })
    
        return updatedUser;
    }
    catch
    {
        return null
    }
    
}

export async function delete_user_by_id(id: string):
    Promise<ClientUser | null>
{
    try
    {
        const updatedUser = await prisma.user.delete({
            where: {id},
            select: {
                id: true,
                username: true,
                email: true
            }
        })
        console.log(updatedUser);
        return updatedUser;
    }
    catch(e)
    {
        console.log(e)
        return null;
    }
}

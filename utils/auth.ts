import crypto from "crypto";
import bcrypt from "bcrypt";

/**
 * Generates a secure token for password reset.
 * @returns A random token string.
 */
export function generateResetToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Hashes a token before storing it in the database.
 * @param token - The raw reset token.
 * @returns The hashed version of the token.
 */
export async function hashToken(token: string): Promise<string> {
    return await bcrypt.hash(token, 10);
}

/**
 * Compares a raw token with a hashed token.
 * @param token - The raw reset token provided by the user.
 * @param hashedToken - The hashed token stored in the database.
 * @returns A boolean indicating if the tokens match.
 */
export async function verifyToken(token: string, hashedToken: string): Promise<boolean> {
    return await bcrypt.compare(token, hashedToken);
}

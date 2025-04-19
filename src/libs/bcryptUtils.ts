import bcrypt from 'bcrypt';

// The number of salt rounds for hashing (higher is more secure but slower)
// Retrieved from environment variables and parsed to integer
const SALT = parseInt(process.env.SALT_ROUNDS!);

/**
 * Hashes a plain text password using bcrypt.
 * 
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - A promise that resolves to the hashed password
 * 
 * @example
 * const hashedPassword = await hashPassword('userPassword123');
 * 
 * @description
 * This function takes a plain text password and generates a secure hash using bcrypt.
 * The hashing process includes salting (with the number of rounds specified in SALT_ROUNDS)
 * to protect against rainbow table attacks. The returned hash contains both the salt and the hash.
 */
export async function hashPassword(password: string): Promise<string> {
    // Generate a hash of the password using bcrypt with the specified salt rounds
    const hash = await bcrypt.hash(password, SALT);
    return hash;
}

/**
 * Verifies a plain text password against a stored hash.
 * 
 * @param {string} password - The plain text password to verify
 * @param {string} hash - The stored hash to compare against
 * @returns {Promise<boolean>} - A promise that resolves to true if the password matches the hash, false otherwise
 * 
 * @example
 * const isValid = await verifyPassword('userPassword123', storedHash);
 * if (isValid) { // allow access }
 * 
 * @description
 * This function compares a plain text password with a bcrypt hash to verify if they match.
 * It securely handles the comparison by hashing the input password with the same salt
 * used in the original hash, then comparing the results. This prevents timing attacks.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    // Compare the plain text password with the stored hash
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}
import { UserRole } from '@schema/sql/users.schema';
import jwt from 'jsonwebtoken';
import { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

// Define your secret key (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DEFAULT_EXPIRES_IN = '60s'; // Default token expiration time

// Interface for token payload (customize based on your needs)
export interface ITokenPayload extends JwtPayload {
    email: string;
    role?: string;
}

/**
 * Generate a JWT token
 * @param payload - Data to include in the token
 * @param options - Optional signing options
 * @returns Generated JWT token
 */
export function generateToken(
    payload: Omit<ITokenPayload, 'iat' | 'exp'>,
    options?: SignOptions
): string {
    const signOptions: SignOptions = {
        expiresIn: DEFAULT_EXPIRES_IN,
        ...options,
    };

    return jwt.sign(payload, JWT_SECRET, signOptions);
}

/**
 * Verify a JWT token
 * @param token - Token to verify
 * @param options - Optional verification options
 * @returns Decoded token payload
 * @throws Error if token is invalid
 */
export function verifyToken(
    token: string,
    options?: VerifyOptions
): ITokenPayload {
    try {
        return jwt.verify(token, JWT_SECRET, options) as ITokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

/**
 * Decode a JWT token without verification
 * @param token - Token to decode
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): ITokenPayload | null {
    try {
        return jwt.decode(token) as ITokenPayload;
    } catch (error) {
        return null;
    }
}


export function generateAuthTokens(id: string, email: string, role: UserRole) {
    const accessToken = generateToken(
        { id, email, role },
        { expiresIn: '1d' }
    );

    const refreshToken = generateToken(
        { id, email, role },
        { expiresIn: '15d' }
    );

    return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
    try {
        // Verify the refresh token
        const decoded = verifyToken(refreshToken);

        // Extract necessary data from the decoded token
        const { email, role } = decoded;

        if (!email || !role) {
            throw new Error('Invalid token payload');
        }

        // Generate a new access token with a fresh expiration
        const newAccessToken = generateToken(
            { email, role },
            { expiresIn: '15m' }
        );

        return newAccessToken;
    } catch (error) {
        // Provide more specific error messages based on the error type
        if (error instanceof Error) {
            if (error.message.includes('expired')) {
                throw new Error('Refresh token has expired');
            }
            if (error.message.includes('invalid')) {
                throw new Error('Invalid refresh token');
            }
        }
        throw new Error('Failed to refresh access token');
    }
}


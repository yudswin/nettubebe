import { getByEmail, getById } from '@services/user.service';
import { decodeToken, ITokenPayload, refreshAccessToken, verifyToken } from '@libs/jwtUtils';
import logger from '@libs/logUtils';
import { User, UserRole } from '@schema/sql/users.schema';
import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '@libs/responseHelper';
;

type AuthOptions = {
    requireAdmin?: boolean;
};

const handleTokenVerification = async (
    req: Request,
    res: Response,
    options?: AuthOptions
): Promise<{ newAccessToken?: string; decodedPayload?: ITokenPayload }> => {
    const context = 'AuthMiddleware';
    const { accesstoken, refreshtoken } = req.headers as {
        accesstoken?: string;
        refreshtoken?: string;
    };

    if (!accesstoken || !refreshtoken) {
        return responseHandler(res, {
            success: false,
            statusCode: 401,
            error: 'Authentication required',
            details: 'Both access token and refresh token are required',
            context
        }), {};
    }

    let accessTokenPayload: ITokenPayload | undefined;
    try {
        accessTokenPayload = verifyToken(accesstoken) as ITokenPayload;
        return { decodedPayload: accessTokenPayload };
    } catch (accessError) {
        if (!(accessError instanceof Error) || !accessError.message.includes('expired')) {
            return responseHandler(res, {
                success: false,
                statusCode: 401,
                error: 'Invalid access token',
                context
            }), {};
        }
        accessTokenPayload = decodeToken(accesstoken) as ITokenPayload;
    }

    let refreshTokenPayload: ITokenPayload;
    try {
        refreshTokenPayload = verifyToken(refreshtoken) as ITokenPayload;
    } catch (refreshError) {
        const isExpired = (refreshError instanceof Error) && refreshError.message.includes('expired');
        return responseHandler(res, {
            success: false,
            statusCode: 401,
            error: isExpired ? 'Refresh token expired' : 'Invalid refresh token',
            details: isExpired ? 'Please re-authenticate' : 'Invalid token provided',
            context
        }), {};
    }

    if (!accessTokenPayload || accessTokenPayload.email !== refreshTokenPayload.email) {
        return responseHandler(res, {
            success: false,
            statusCode: 401,
            error: 'Token mismatch',
            details: `Email mismatch between tokens: ${accessTokenPayload?.email} vs ${refreshTokenPayload.email}`,
            context
        }), {};
    }

    try {
        const newAccessToken = await refreshAccessToken(refreshtoken);
        const newAccessTokenPayload = decodeToken(newAccessToken) as ITokenPayload;
        if (newAccessTokenPayload.role) {
            if (options?.requireAdmin && !['admin', 'moderator'].includes(newAccessTokenPayload.role)) {
                return responseHandler(res, {
                    success: false,
                    statusCode: 403,
                    error: 'Access denied',
                    details: `Insufficient privileges for ${newAccessTokenPayload.email} with role ${newAccessTokenPayload.role}`,
                    context
                }), {};
            }
        }
        res.setHeader('New-Access-Token', newAccessToken);
        return { newAccessToken, decodedPayload: newAccessTokenPayload };
    } catch (error) {
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            error: 'Token refresh failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            context
        }), {};
    }
};

export const authDev = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await handleTokenVerification(req, res, { requireAdmin: true });
    if (result.decodedPayload) {
        logger.info(`Access granted for ${result.decodedPayload.email}`, 'AuthMiddleware');
        next();
    }
};

export const authUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await handleTokenVerification(req, res);
    if (result.decodedPayload) {
        next();
    }
};

type VerifiedUserResult =
    | { success: true; user: User }
    | { success: false };

export const verifyEmailFromHeaders = async (
    req: Request,
    res: Response,
): Promise<VerifiedUserResult> => {
    const context = 'verifyUserFromHeaders';
    const { accesstoken, refreshtoken } = req.headers as {
        accesstoken?: string;
        refreshtoken?: string;
    };

    if (!accesstoken && !refreshtoken) {
        responseHandler(res, {
            success: false,
            statusCode: 401,
            error: 'Authentication required',
            details: 'No authentication tokens provided',
            context
        });
        return { success: false };
    }

    const token = accesstoken || refreshtoken;
    const decoded = token ? decodeToken(token) : null;

    if (!decoded?.id) {
        responseHandler(res, {
            success: false,
            statusCode: 401,
            error: 'Invalid token',
            details: 'Token missing or malformed',
            context
        });
        return { success: false };
    }

    try {
    const existed = await getById(decoded.id);
        if (!existed) {
            responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'User not found',
                details: `No user exists with email: ${decoded.email}`,
                context
            });
            return { success: false };
        }

        return { success: true, user: existed };
    } catch (error) {
        responseHandler(res, {
            success: false,
            statusCode: 500,
            error: 'Server error',
            details: error instanceof Error ? error.message : 'Failed to verify user',
            context
        });
        return { success: false };
    }
};
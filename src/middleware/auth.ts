import { decodeToken, ITokenPayload, refreshAccessToken, verifyToken } from '@libs/jwtUtils';
import logger from '@libs/logUtils';
import { userRoles } from '@schema/sql/user.schema';
import { Request, Response, NextFunction } from 'express';
import * as handler from './handler/tokenStatus';

type AuthOptions = {
    requireAdmin?: boolean;
};

const handleTokenVerification = async (
    req: Request,
    res: Response,
    options?: AuthOptions
): Promise<{ newAccessToken?: string; decodedPayload?: ITokenPayload }> => {
    const { accesstoken, refreshtoken } = req.headers as {
        accesstoken?: string;
        refreshtoken?: string;
    };

    if (!accesstoken || !refreshtoken) {
        logger.warn('Access token or refresh token missing', 'AuthMiddleware');
        handler.missingTokens(res);
        return {};
    }

    let accessTokenPayload: ITokenPayload | undefined;
    try {
        accessTokenPayload = verifyToken(accesstoken) as ITokenPayload;
        return { decodedPayload: accessTokenPayload };
    } catch (accessError) {
        if (!(accessError instanceof Error) || !accessError.message.includes('expired')) {
            logger.warn('Invalid access token', 'AuthMiddleware');
            handler.invalidAccessToken(res);
            return {};
        }
        accessTokenPayload = decodeToken(accesstoken) as ITokenPayload;
    }

    let refreshTokenPayload: ITokenPayload;
    try {
        refreshTokenPayload = verifyToken(refreshtoken) as ITokenPayload;
    } catch (refreshError) {
        const isExpired = (refreshError instanceof Error) && refreshError.message.includes('expired');
        isExpired ? handler.expiredRefreshToken(res) : handler.invalidRefreshToken(res);
        logger.warn(isExpired ? 'Refresh token expired' : 'Invalid refresh token', 'AuthMiddleware');
        return {};
    }

    if (!accessTokenPayload || accessTokenPayload.email !== refreshTokenPayload.email) {
        logger.warn(`Token mismatch: ${accessTokenPayload?.email} vs ${refreshTokenPayload.email}`, 'AuthMiddleware');
        handler.tokenMismatch(res);
        return {};
    }

    try {
        const newAccessToken = await refreshAccessToken(refreshtoken);
        const newAccessTokenPayload = decodeToken(newAccessToken) as ITokenPayload;
        
        if (options?.requireAdmin && !(newAccessTokenPayload.role === userRoles[1] || newAccessTokenPayload.role === userRoles[2])) {
            logger.warn(`Access denied for ${newAccessTokenPayload.email} with role ${newAccessTokenPayload.role}`, 'AuthMiddleware');
            res.status(403).json({ error: 'Access denied' });
            return {};
        }

        res.setHeader('New-Access-Token', newAccessToken);
        logger.info(`Issued new access token for ${newAccessTokenPayload.email}`, 'AuthMiddleware');
        return { newAccessToken, decodedPayload: newAccessTokenPayload };
    } catch (error) {
        logger.error('Token refresh failed', 'AuthMiddleware');
        handler.invalidAccessToken(res);
        return {};
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
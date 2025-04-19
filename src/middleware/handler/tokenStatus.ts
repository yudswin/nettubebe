import { Response } from "express";

export const missingTokens = (res: Response) => {
    return res.status(400).json({
        error: 'Both tokens are required',
        code: 'TOKENS_MISSING'
    });
};

export const invalidAccessToken = (res: Response) => {
    res.status(401).json({
        error: 'Invalid access token',
        code: 'INVALID_ACCESS_TOKEN'
    });
};

export const expiredRefreshToken = (res: Response) => {
    res.status(401).json({
        error: 'Refresh token expired',
        code: 'REFRESH_TOKEN_EXPIRED'
    });
};

export const invalidRefreshToken = (res: Response) => {
    res.status(401).json({
        error: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
    });
};

export const tokenMismatch = (res: Response) => {
    res.status(401).json({
        error: 'Token mismatch',
        code: 'TOKEN_MISMATCH'
    });
};

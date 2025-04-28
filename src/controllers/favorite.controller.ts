import { Request, Response } from 'express';
import * as favoriteService from "@services/favorite.service";
import { responseHandler } from '@libs/responseHelper';
import { NewFavorite } from '@schema/sql/favorites.schema';

const context = 'FavoriteController';

export const createFavorite = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, contentId } = req.body;

        if (!userId || !contentId) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required fields',
                details: {
                    userId: !userId ? 'User ID is required' : undefined,
                    contentId: !contentId ? 'Content ID is required' : undefined
                },
                context
            });
        }

        const favoriteData: NewFavorite = {
            userId,
            contentId,
            favoritedAt: new Date()
        };

        const favorite = await favoriteService.createFavorite(favoriteData);

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Content favorited',
            result: favorite,
            context
        });
    } catch (error) {
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
            context
        });
    }
};

export const getFavorite = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, contentId } = req.params;
        const favorite = await favoriteService.getFavorite(userId, contentId);

        if (!favorite) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Favorite not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: favorite,
            context
        });
    } catch (error) {
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
            context
        });
    }
};

export const getUserFavorites = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const favorites = await favoriteService.getUserFavorites(userId);

        return responseHandler(res, {
            success: true,
            statusCode: favorites.length > 0 ? 200 : 204,
            result: favorites,
            context
        });
    } catch (error) {
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
            context
        });
    }
};

export const getContentFavorites = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const favorites = await favoriteService.getContentFavorites(contentId);

        return responseHandler(res, {
            success: true,
            statusCode: favorites.length > 0 ? 200 : 204,
            result: favorites,
            context
        });
    } catch (error) {
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
            context
        });
    }
};

export const deleteFavorite = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, contentId } = req.params;

        const existingFavorite = await favoriteService.getFavorite(userId, contentId);
        if (!existingFavorite) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Favorite not found',
                context
            });
        }

        await favoriteService.deleteFavorite(userId, contentId);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Favorite removed',
            context
        });
    } catch (error) {
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
            context
        });
    }
};
import { Request, Response } from 'express';
import * as contentGenreService from "@services/contentGenre.service";
import { responseHandler } from '@libs/responseHelper';

const context = 'ContentGenreController';

export const addGenresToContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const { genreIds } = req.body;

        if (!Array.isArray(genreIds)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid request format',
                details: 'Expected array of genre IDs',
                context
            });
        }

        if (genreIds.some(id => typeof id !== 'string')) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid genre data',
                details: 'All genre IDs must be strings',
                context
            });
        }

        const uniqueIds = [...new Set(genreIds)];
        if (uniqueIds.length !== genreIds.length) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Duplicate genres',
                details: 'Cannot add the same genre multiple times',
                context
            });
        }

        const result = await contentGenreService.addGenresToContent(contentId, uniqueIds);
        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: `Added ${uniqueIds.length} genres to content`,
            result,
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

export const getGenresForContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const genres = await contentGenreService.getGenresForContent(contentId);

        if (!genres) {
            return responseHandler(res, {
                success: true,
                statusCode: 204,
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: genres.length > 0 ? 200 : 204,
            result: genres,
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

export const removeGenresFromContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const { genreIds } = req.body;

        if (!Array.isArray(genreIds) || genreIds.length === 0) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid request format',
                details: 'Expected array of genre IDs to remove',
                context
            });
        }

        await contentGenreService.removeGenresFromContent(contentId, genreIds);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: `Removed ${genreIds.length} genres from content`,
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

export const setGenresForContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const { genreIds } = req.body;

        if (!Array.isArray(genreIds)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid request format',
                details: 'Expected array of genre IDs',
                context
            });
        }

        const uniqueIds = [...new Set(genreIds)];
        if (uniqueIds.length !== genreIds.length) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Duplicate genres',
                details: 'Cannot add the same genre multiple times',
                context
            });
        }

        await contentGenreService.setGenresForContent(contentId, uniqueIds);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: `Updated content genres with ${uniqueIds.length} entries`,
            result: uniqueIds,
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
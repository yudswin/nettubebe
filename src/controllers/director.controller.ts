import { Request, Response } from 'express';
import * as directorService from "@services/director.service";
import { responseHandler } from '@libs/responseHelper';

const context = 'DirectorController';

export const addDirectorsToContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const directorsData = req.body;

        if (!Array.isArray(directorsData)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid request format',
                details: 'Expected array of directors',
                context
            });
        }

        const invalidEntries = directorsData.filter(entry =>
            !entry.personId || typeof entry.rank !== 'number'
        );

        if (invalidEntries.length > 0) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid director data',
                details: 'Each director must have personId and rank',
                context
            });
        }

        const personIds = directorsData.map(d => d.personId);
        if (new Set(personIds).size !== personIds.length) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Duplicate directors',
                details: 'Cannot add the same person multiple times',
                context
            });
        }

        const result = await directorService.addDirectorsToContent(contentId, directorsData);
        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: `Added ${directorsData.length} directors to content`,
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

export const getDirectorsForContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const directors = await directorService.getDirectorsForContent(contentId);
        if (!directors) {
            return responseHandler(res, {
                success: true,
                statusCode: 204,
                context
            });
        }
        return responseHandler(res, {
            success: true,
            statusCode: directors.length > 0 ? 200 : 204,
            result: directors,
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

export const removeDirectorsFromContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const { personIds } = req.body;

        if (!Array.isArray(personIds) || personIds.length === 0) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid request format',
                details: 'Expected array of person IDs to remove',
                context
            });
        }

        await directorService.removeDirectorsFromContent(contentId, personIds);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: `Removed ${personIds.length} directors from content`,
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

export const setDirectorsForContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const directorsData = req.body;

        if (!Array.isArray(directorsData)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid request format',
                details: 'Expected array of directors',
                context
            });
        }

        const invalidEntries = directorsData.filter(entry =>
            !entry.personId || typeof entry.rank !== 'number'
        );

        if (invalidEntries.length > 0) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid director data',
                details: 'Each director must have personId and rank',
                context
            });
        }

        const personIds = directorsData.map(d => d.personId);
        if (new Set(personIds).size !== personIds.length) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Duplicate directors',
                details: 'Cannot add the same person multiple times',
                context
            });
        }

        await directorService.setDirectorsForContent(contentId, directorsData);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: `Updated content directors with ${directorsData.length} members`,
            result: directorsData,
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
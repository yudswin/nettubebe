import { Request, Response } from 'express';
import * as castService from "@services/cast.service";
import { responseHandler } from '@libs/responseHelper';

const context = 'CastController';
export const addCastsToContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const castsData = req.body;

        // Validate request body
        if (!Array.isArray(castsData)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid request format',
                details: 'Expected array of cast members',
                context
            });
        }

        // Validate individual cast members
        const invalidEntries = castsData.filter(entry => 
            !entry.personId || !entry.character || typeof entry.rank !== 'number'
        );

        if (invalidEntries.length > 0) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid cast data',
                details: 'Each cast member must have personId, character, and rank',
                context
            });
        }

        // Check for duplicate personIds in request
        const personIds = castsData.map(c => c.personId);
        if (new Set(personIds).size !== personIds.length) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Duplicate cast members',
                details: 'Cannot add the same person multiple times',
                context
            });
        }

        const result = await castService.addCastsToContent(contentId, castsData);
        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: `Added ${castsData.length} cast members to content`,
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

export const getCastsForContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const casts = await castService.getCastsForContent(contentId);
        if (!casts) {
            return responseHandler(res, {
                success: true,
                statusCode: 204,
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: casts.length > 0 ? 200 : 204,
            result: casts,
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

export const removeCastsFromContent = async (req: Request, res: Response): Promise<any> => {
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

        await castService.removeCastsFromContent(contentId, personIds);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: `Removed ${personIds.length} cast members from content`,
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

export const setCastsForContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const castsData = req.body;

        // Validate request body
        if (!Array.isArray(castsData)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid request format',
                details: 'Expected array of cast members',
                context
            });
        }

        // Validate individual cast members
        const invalidEntries = castsData.filter(entry => 
            !entry.personId || !entry.character || typeof entry.rank !== 'number'
        );

        if (invalidEntries.length > 0) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid cast data',
                details: 'Each cast member must have personId, character, and rank',
                context
            });
        }

        // Check for duplicate personIds in request
        const personIds = castsData.map(c => c.personId);
        if (new Set(personIds).size !== personIds.length) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Duplicate cast members',
                details: 'Cannot add the same person multiple times',
                context
            });
        }

        await castService.setCastsForContent(contentId, castsData);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: `Updated content cast with ${castsData.length} members`,
            result: castsData,
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

export const getContentForCast = async (req: Request, res: Response): Promise<any> => {
    try {
        const { personId } = req.params;
        const contents = await castService.getContentForCast(personId);
        if (!contents) {
            return responseHandler(res, {
                success: true,
                statusCode: 204,
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: contents.length > 0 ? 200 : 204,
            result: contents,
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
import { Request, Response } from 'express';
import * as historyService from "@services/history.service";
import { responseHandler } from '@libs/responseHelper';
import { NewHistory } from '@schema/sql/history.schema';

const context = 'HistoryController';

const validateProgress = (progress: number) => {
    return Number.isInteger(progress) && progress >= 0 && progress <= 100;
};

export const createHistory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, mediaId, progress } = req.body;

        // Validate required fields
        if (!userId || !mediaId || progress === undefined) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required fields',
                details: {
                    userId: !userId ? 'User ID is required' : undefined,
                    mediaId: !mediaId ? 'Media ID is required' : undefined,
                    progress: progress === undefined ? 'Progress is required' : undefined
                },
                context
            });
        }

        // Validate progress
        if (!validateProgress(progress)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid progress',
                details: 'Progress must be an integer between 0 and 100',
                context
            });
        }

        const historyData: NewHistory = {
            userId,
            mediaId,
            progress,
            watchedAt: new Date()
        };

        const historyEntry = await historyService.createHistory(historyData);

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'History entry updated',
            result: historyEntry,
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

export const getHistoryEntry = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, mediaId } = req.params;
        const entry = await historyService.getHistoryEntry(userId, mediaId);

        if (!entry) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'History entry not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: entry,
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

export const getUserHistory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const history = await historyService.getUserHistory(userId);

        return responseHandler(res, {
            success: true,
            statusCode: history.length > 0 ? 200 : 204,
            result: history,
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

export const getMediaHistory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { mediaId } = req.params;
        const history = await historyService.getMediaHistory(mediaId);

        return responseHandler(res, {
            success: true,
            statusCode: history.length > 0 ? 200 : 204,
            result: history,
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

export const updateHistory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, mediaId } = req.params;
        const { progress } = req.body;

        // Validate progress
        if (progress !== undefined && !validateProgress(progress)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid progress',
                details: 'Progress must be an integer between 0 and 100',
                context
            });
        }

        const updateData = {
            progress,
            watchedAt: new Date()
        };

        const updatedEntry = await historyService.updateHistory(
            userId,
            mediaId,
            updateData
        );

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'History entry updated',
            result: updatedEntry,
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

export const deleteHistory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, mediaId } = req.params;

        const existingEntry = await historyService.getHistoryEntry(userId, mediaId);
        if (!existingEntry) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'History entry not found',
                context
            });
        }

        await historyService.deleteHistory(userId, mediaId);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'History entry deleted',
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
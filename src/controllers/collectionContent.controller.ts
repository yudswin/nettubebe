import { Request, Response } from 'express';
import * as collectionContentService from "@services/collectionContent.service";
import * as collectionService from "@services/collection.service";
import * as contentService from "@services/content.service";
import { responseHandler } from '@libs/responseHelper';

const context = 'CollectionContentController';
export const addContentToCollection = async (req: Request, res: Response): Promise<any> => {
    try {
        const { collectionId, contentId } = req.params;
        const { rank } = req.body;

        // Validate required parameters
        if (!collectionId || !contentId) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required parameters',
                context
            });
        }

        // Check collection existence
        const collection = await collectionService.getCollectionById(collectionId);
        if (!collection) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Collection not found',
                context
            });
        }

        // Check content existence
        const content = await contentService.getContentById(contentId);
        if (!content) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Content not found',
                context
            });
        }

        // Check existing association
        const existingAssociation = await collectionContentService.getCollectionContent(collectionId, contentId);
        if (existingAssociation) {
            return responseHandler(res, {
                success: false,
                statusCode: 409,
                error: 'Content already in collection',
                context
            });
        }

        const newAssociation = await collectionContentService.addContentToCollection(
            collectionId,
            contentId,
            rank || 1
        );

        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: 'Content added to collection',
            result: newAssociation,
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

export const getCollectionContents = async (req: Request, res: Response): Promise<any> => {
    try {
        const { collectionId } = req.params;
        const { limit } = req.body

        const collection = await collectionService.getCollectionById(collectionId);
        if (!collection) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Collection not found',
                context
            });
        }

        const contents = await collectionContentService.getCollectionContents(collectionId, limit);
        if (!contents) {
            return responseHandler(res, {
                success: false,
                statusCode: 500,
                error: 'Error occurs in database.'
            })
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

export const updateContentRank = async (req: Request, res: Response): Promise<any> => {
    try {
        const { collectionId, contentId } = req.params;
        const { rank } = req.body;

        if (!rank || isNaN(Number(rank))) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Valid rank is required',
                context
            });
        }

        const association = await collectionContentService.getCollectionContent(collectionId, contentId);
        if (!association) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Content not found in collection',
                context
            });
        }

        const updatedAssociation = await collectionContentService.updateContentRank(
            collectionId,
            contentId,
            Number(rank)
        );

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Content rank updated',
            result: updatedAssociation,
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

export const removeContentFromCollection = async (req: Request, res: Response): Promise<any> => {
    try {
        const { collectionId, contentId } = req.params;

        const association = await collectionContentService.getCollectionContent(collectionId, contentId);
        if (!association) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Content not found in collection',
                context
            });
        }

        await collectionContentService.removeContentFromCollection(collectionId, contentId);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Content removed from collection',
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

export const getTopicCollectionContents = async (req: Request, res: Response): Promise<any> => {
    try {
        const { limitContents, limitCollections } = req.body;
        const contents = await collectionContentService.getTopicCollectionContents(Number(limitCollections), Number(limitContents));

        return responseHandler(res, {
            success: true,
            statusCode: contents && contents.length > 0 ? 200 : 204,
            result: contents || [],
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
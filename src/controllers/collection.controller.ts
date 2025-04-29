import { Request, Response } from 'express';
import * as collectionService from "@services/collection.service";
import { responseHandler } from '@libs/responseHelper';
import { NewCollection, CollectionType } from '@schema/sql/collections.schema';
import { nanoid } from 'nanoid';

const context = 'CollectionController';

const validateCollectionType = (type: string): type is 'topic' | 'hot' | 'features' => {
    return ['topic', 'hot', 'features'].includes(type);
};

export const createCollection = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            name,
            slug,
            description,
            type,
            publish
        } = req.body;

        // Validate required fields
        if (!name || !slug || !type) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required fields',
                details: {
                    name: !name ? 'Name is required' : undefined,
                    slug: !slug ? 'Slug is required' : undefined,
                    type: !type ? 'Type is required' : undefined
                },
                context
            });
        }

        // Validate collection type
        if (!validateCollectionType(type)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid collection type',
                details: 'Type must be one of: topic, hot, features',
                context
            });
        }

        // Check existing slug
        const existingSlug = await collectionService.getCollectionBySlug(slug);
        if (existingSlug) {
            return responseHandler(res, {
                success: false,
                statusCode: 409,
                error: 'Slug already exists',
                details: 'Collection with this slug already exists',
                context
            });
        }

        const collectionData: NewCollection = {
            _id: nanoid(12),
            name,
            slug,
            description: description || null,
            type,
            publish: publish || false
        };

        const createdCollection = await collectionService.createCollection(collectionData);
        if (!createdCollection) {
            return responseHandler(res, {
                success: false,
                statusCode: 500,
                error: `Error occurs in database.`,
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: `Collection created: ${createdCollection.name}`,
            result: createdCollection,
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

export const getAllCollections = async (req: Request, res: Response): Promise<any> => {
    try {
        const collections = await collectionService.getAllCollections();
        if (!collections) {
            return responseHandler(res, {
                success: false,
                statusCode: 500,
                error: `Error occurs in database.`,
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: collections.length > 0 ? 200 : 204,
            result: collections,
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

export const getCollectionById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const collection = await collectionService.getCollectionById(id);

        if (!collection) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Collection not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: collection,
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

export const getCollectionBySlug = async (req: Request, res: Response): Promise<any> => {
    try {
        const { slug } = req.params;
        const collection = await collectionService.getCollectionBySlug(slug);

        if (!collection) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Collection not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: collection,
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

export const updateCollection = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check existing collection
        const existingCollection = await collectionService.getCollectionById(id);
        if (!existingCollection) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Collection not found',
                context
            });
        }

        // Validate collection type if provided
        if (updateData.type && !validateCollectionType(updateData.type)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid collection type',
                details: 'Type must be one of: topic, hot, features',
                context
            });
        }

        // Check slug conflicts
        if (updateData.slug && updateData.slug !== existingCollection.slug) {
            const slugConflict = await collectionService.getCollectionBySlug(updateData.slug);
            if (slugConflict) {
                return responseHandler(res, {
                    success: false,
                    statusCode: 409,
                    error: 'Slug already exists',
                    details: 'Another collection is using this slug',
                    context
                });
            }
        }

        const updateResult = await collectionService.updateCollection(id, updateData);

        if (!updateResult.success) {
            throw new Error('Failed to update collection');
        }

        const updatedCollection = await collectionService.getCollectionById(id);

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Collection updated successfully',
            result: updatedCollection,
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

export const deleteCollection = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const existingCollection = await collectionService.getCollectionById(id);
        if (!existingCollection) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Collection not found',
                context
            });
        }

        await collectionService.deleteCollection(id);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Collection deleted successfully',
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

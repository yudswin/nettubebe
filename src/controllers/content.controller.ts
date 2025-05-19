import { Request, Response } from 'express';
import * as contentService from "@services/content.service";
import { responseHandler } from '@libs/responseHelper';
import { NewContent } from '@schema/sql/contents.schema';
import { nanoid } from 'nanoid';

const context = 'ContentController';

const validateContentType = (type: string): type is 'movie' | 'tvshow' => {
    return ['movie', 'tvshow'].includes(type);
};

const validateContentStatus = (status: string): status is 'upcoming' | 'finish' | 'updating' => {
    return ['upcoming', 'finish', 'updating'].includes(status);
};

export const createContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            title,
            originTitle,
            englishTitle,
            slug,
            overview,
            imdbRating,
            lastestEpisode,
            lastestSeason,
            rating,
            runtime,
            releaseDate,
            year,
            publish,
            thumbnailPath,
            bannerPath,
            type,
            status
        } = req.body;

        // Validate required fields
        if (!title || !slug || !overview || !releaseDate || !year || !type || !status) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required fields',
                details: {
                    title: !title ? 'Title is required' : undefined,
                    slug: !slug ? 'Slug is required' : undefined,
                    overview: !overview ? 'Overview is required' : undefined,
                    releaseDate: !releaseDate ? 'Release date is required' : undefined,
                    year: !year ? 'Year is required' : undefined,
                    type: !type ? 'Type is required' : undefined,
                    status: !status ? 'Status is required' : undefined
                },
                context
            });
        }

        // Validate enums
        if (!validateContentType(type)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid content type',
                details: 'Type must be either "movie" or "tvshow"',
                context
            });
        }

        if (!validateContentStatus(status)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid content status',
                details: 'Status must be one of: upcoming, finish, updating',
                context
            });
        }

        // Check existing slug
        const existingSlug = await contentService.getContentBySlug(slug);
        if (existingSlug) {
            return responseHandler(res, {
                success: false,
                statusCode: 409,
                error: 'Slug already exists',
                details: 'Content with this slug already exists',
                context
            });
        }

        const contentData: NewContent = {
            _id: nanoid(12),
            title,
            originTitle: originTitle || null,
            englishTitle: englishTitle || null,
            slug,
            overview,
            imdbRating: imdbRating || "0.0",
            lastestEpisode: lastestEpisode || null,
            lastestSeason: lastestSeason || null,
            rating: rating || "0.0",
            runtime: runtime || null,
            releaseDate: new Date(releaseDate),
            year,
            publish: publish || false,
            thumbnailPath: thumbnailPath || null,
            bannerPath: bannerPath || null,
            type,
            status
        };

        const createdContent = await contentService.createContent(contentData);

        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: `Content created: ${createdContent?.title}`,
            result: createdContent,
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

export const getAllContents = async (req: Request, res: Response): Promise<any> => {
    try {
        const contents = await contentService.getAllContents();
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

export const getContentById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const content = await contentService.getContentById(id);

        if (!content) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Content not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: content,
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

export const getContentBySlug = async (req: Request, res: Response): Promise<any> => {
    try {
        const { slug } = req.params;
        const content = await contentService.getContentBySlug(slug);

        if (!content) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Content not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: content,
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

export const updateContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check existing content
        const existingContent = await contentService.getContentById(id);
        if (!existingContent) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Content not found',
                context
            });
        }

        // Validate enums if provided
        if (updateData.type && !validateContentType(updateData.type)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid content type',
                details: 'Type must be either "movie" or "tvshow"',
                context
            });
        }

        if (updateData.status && !validateContentStatus(updateData.status)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid content status',
                details: 'Status must be one of: upcoming, finish, updating',
                context
            });
        }

        // Check slug conflicts
        if (updateData.slug && updateData.slug !== existingContent.slug) {
            const slugConflict = await contentService.getContentBySlug(updateData.slug);
            if (slugConflict) {
                return responseHandler(res, {
                    success: false,
                    statusCode: 409,
                    error: 'Slug already exists',
                    details: 'Another content is using this slug',
                    context
                });
            }
        }

        // Handle date conversion
        if (updateData.releaseDate) {
            updateData.releaseDate = new Date(updateData.releaseDate);
        }

        const updatedContent = await contentService.updateContent(id, updateData);

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Content updated successfully',
            result: updatedContent,
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

export const deleteContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const existingContent = await contentService.getContentById(id);
        if (!existingContent) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Content not found',
                context
            });
        }

        await contentService.deleteContent(id);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Content deleted successfully',
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

export const searchContents = async (req: Request, res: Response): Promise<any> => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q || typeof q !== 'string') {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Search query is required',
                context
            });
        }

        const results = await contentService.searchContents(q, Number(page), Number(limit));

        return responseHandler(res, {
            success: true,
            statusCode: results.length > 0 ? 200 : 204,
            result: results,
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

export const browseContents = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            years,
            type,
            status,
            genreSlugs,
            countrySlugs,
            page = 1,
            limit = 10
        } = req.query;

        const filters: any = {
            page: Number(page),
            limit: Number(limit)
        };

        if (years) {
            if (typeof years === 'string') {
                if (years.includes(',')) {
                    filters.years = years.split(',').map(y => Number(y.trim()));
                } else {
                    filters.years = [Number(years)];
                }
            } else if (Array.isArray(years)) {
                filters.years = years.map(y => Number(y));
            }
        }

        if (type && typeof type === 'string' && ['movie', 'tvshow'].includes(type)) {
            filters.type = type as 'movie' | 'tvshow';
        }

        if (status && typeof status === 'string' && ['upcoming', 'finish', 'updating'].includes(status)) {
            filters.status = status as 'upcoming' | 'finish' | 'updating';
        }

        let parsedGenreSlugs: string[] | undefined;
        if (typeof genreSlugs === "string") {
            parsedGenreSlugs = genreSlugs.split(",").map(s => s.trim());
        } else if (Array.isArray(genreSlugs)) {
            parsedGenreSlugs = genreSlugs.map(s => String(s));
        }

        let parsedCountrySlugs: string[] | undefined;
        if (typeof countrySlugs === "string") {
            parsedCountrySlugs = countrySlugs.split(",").map(s => s.trim());
        } else if (Array.isArray(countrySlugs)) {
            parsedCountrySlugs = countrySlugs.map(s => String(s));
        }

        const result = await contentService.browseContents({
            ...filters,
            genreSlugs: parsedGenreSlugs,
            countrySlugs: parsedCountrySlugs,
        });

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: result,
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
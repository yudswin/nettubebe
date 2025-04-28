import { Request, Response } from 'express';
import * as genreService from "@services/genre.service";
import { responseHandler } from '@libs/responseHelper';
import { NewGenres } from '@schema/sql/genres.schema';
import { nanoid } from 'nanoid';

const context = 'GenreController';

export const createGenre = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, englishName, slug } = req.body;

        // Check required fields
        if (!name || !englishName || !slug) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required fields',
                details: {
                    name: name ? undefined : 'Name is required',
                    englishName: englishName ? undefined : 'English name is required',
                    slug: slug ? undefined : 'Slug is required'
                },
                context
            });
        }

        // Check for existing slug
        const existingSlug = await genreService.getGenreBySlug(slug);
        if (existingSlug) {
            return responseHandler(res, {
                success: false,
                statusCode: 409,
                error: 'Slug already exists',
                details: 'A genre with this slug already exists',
                context
            });
        }

        // Create new genre
        const genreData: NewGenres = {
            _id: nanoid(12),
            name,
            englishName,
            slug
        };

        const createdGenre = await genreService.createGenre(genreData);

        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: `Genre created successfully: ${createdGenre?.name}`,
            result: createdGenre,
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

export const getAllGenres = async (req: Request, res: Response): Promise<any> => {
    try {
        const genres = await genreService.getAllGenres();
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

export const getGenreById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const genre = await genreService.getGenreById(id);

        if (!genre) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Genre not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: genre,
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

export const getGenreBySlug = async (req: Request, res: Response): Promise<any> => {
    try {
        const { slug } = req.params;
        const genre = await genreService.getGenreBySlug(slug);

        if (!genre) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Genre not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: genre,
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

export const updateGenre = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, englishName, slug } = req.body;

        // Check for existing genre
        const existingGenre = await genreService.getGenreById(id);
        if (!existingGenre) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Genre not found',
                context
            });
        }

        // Check for slug conflicts
        if (slug && slug !== existingGenre.slug) {
            const slugConflict = await genreService.getGenreBySlug(slug);
            if (slugConflict) {
                return responseHandler(res, {
                    success: false,
                    statusCode: 409,
                    error: 'Slug already exists',
                    details: 'Another genre is using this slug',
                    context
                });
            }
        }

        // Update genre
        const updateData = {
            name: name || existingGenre.name,
            englishName: englishName || existingGenre.englishName,
            slug: slug || existingGenre.slug
        };

        const updatedGenre = await genreService.updateGenre(id, updateData);

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Genre updated successfully',
            result: updatedGenre,
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

export const deleteGenre = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        // Check if genre exists
        const existingGenre = await genreService.getGenreById(id);
        if (!existingGenre) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Genre not found',
                context
            });
        }

        await genreService.deleteGenre(id);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Genre deleted successfully',
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
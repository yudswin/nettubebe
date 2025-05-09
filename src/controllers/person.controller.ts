import { Request, Response } from 'express';
import * as personService from "@services/person.service";
import { responseHandler } from '@libs/responseHelper';
import { NewPerson } from '@schema/sql/person.schema';
import { nanoid } from 'nanoid';

const context = 'PersonController';

export const createPerson = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, slug, profilePath } = req.body;

        // Validate required fields
        if (!name || !slug) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required fields',
                details: {
                    name: name ? undefined : 'Name is required',
                    slug: slug ? undefined : 'Slug is required'
                },
                context
            });
        }

        // Check for existing slug
        const existingSlug = await personService.getPersonBySlug(slug);
        if (existingSlug) {
            return responseHandler(res, {
                success: false,
                statusCode: 409,
                error: 'Slug already exists',
                details: 'A person with this slug already exists',
                context
            });
        }

        const personData: NewPerson = {
            _id: nanoid(12),
            name,
            slug,
            profilePath: profilePath || null
        };

        const createdPerson = await personService.createPerson(personData);

        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: `Person created: ${createdPerson?.name}`,
            result: createdPerson,
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

export const getAllPersons = async (req: Request, res: Response): Promise<any> => {
    try {
        const persons = await personService.getAllPersons();
        return responseHandler(res, {
            success: true,
            statusCode: persons.length > 0 ? 200 : 204,
            result: persons,
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

export const getPersonById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const person = await personService.getPersonById(id);

        if (!person) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Person not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: person,
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

export const getPersonBySlug = async (req: Request, res: Response): Promise<any> => {
    try {
        const { slug } = req.params;
        const person = await personService.getPersonBySlug(slug);

        if (!person) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Person not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: person,
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

export const updatePerson = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, slug, profilePath } = req.body;

        // Check existing person
        const existingPerson = await personService.getPersonById(id);
        if (!existingPerson) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Person not found',
                context
            });
        }

        // Prepare update data
        const updateData = {
            name: name || existingPerson.name,
            slug: slug || existingPerson.slug,
            profilePath: profilePath ?? existingPerson.profilePath
        };

        // Check for slug conflicts
        if (updateData.slug !== existingPerson.slug) {
            const slugConflict = await personService.getPersonBySlug(updateData.slug);
            if (slugConflict) {
                return responseHandler(res, {
                    success: false,
                    statusCode: 409,
                    error: 'Slug already exists',
                    details: 'Another person is using this slug',
                    context
                });
            }
        }

        const updatedPerson = await personService.updatePerson(id, updateData);

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Person updated successfully',
            result: updatedPerson,
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

export const deletePerson = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const existingPerson = await personService.getPersonById(id);
        if (!existingPerson) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Person not found',
                context
            });
        }

        await personService.deletePerson(id);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Person deleted successfully',
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

export const searchPerson = async (req: Request, res: Response): Promise<any> => {
    try {
        const { q, page = 1, limit = 10 } = req.query
        if (!q || typeof q !== 'string') {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Search query is required',
                context
            });
        }

        const results = await personService.searchPerson(q, Number(page), Number(limit));
        
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
}
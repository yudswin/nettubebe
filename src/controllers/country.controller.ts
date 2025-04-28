import { Request, Response } from 'express';
import * as countryService from "@services/country.service";
import { responseHandler } from '@libs/responseHelper';
import { NewCountry } from '@schema/sql/countries.schema';
import { nanoid } from 'nanoid';

const context = 'CountryController';

export const createCountry = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, slug, code } = req.body;

        // Validate required fields
        if (!name || !slug || !code) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required fields',
                details: {
                    name: name ? undefined : 'Name is required',
                    slug: slug ? undefined : 'Slug is required',
                    code: code ? undefined : 'Country code is required'
                },
                context
            });
        }

        // Validate country code format
        if (code.length !== 2) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid country code',
                details: 'Country code must be exactly 2 characters long',
                context
            });
        }

        // Check for existing code or slug
        const [existingCode, existingSlug] = await Promise.all([
            countryService.getCountryByCode(code),
            countryService.getCountryBySlug(slug)
        ]);

        if (existingCode) {
            return responseHandler(res, {
                success: false,
                statusCode: 409,
                error: 'Country code exists',
                details: 'A country with this code already exists',
                context
            });
        }

        if (existingSlug) {
            return responseHandler(res, {
                success: false,
                statusCode: 409,
                error: 'Slug exists',
                details: 'A country with this slug already exists',
                context
            });
        }

        const countryData: NewCountry = {
            _id: nanoid(12),
            name,
            slug,
            code: code.toUpperCase()
        };

        const createdCountry = await countryService.createCountry(countryData);

        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: `Country created: ${createdCountry?.name}`,
            result: createdCountry,
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

export const getAllCountries = async (req: Request, res: Response): Promise<any> => {
    try {
        const countries = await countryService.getAllCountries();
        return responseHandler(res, {
            success: true,
            statusCode: countries.length > 0 ? 200 : 204,
            result: countries,
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

export const getCountryById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const country = await countryService.getCountryById(id);

        if (!country) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Country not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: country,
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

export const getCountryBySlug = async (req: Request, res: Response): Promise<any> => {
    try {
        const { slug } = req.params;
        const country = await countryService.getCountryBySlug(slug);

        if (!country) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Country not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: country,
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

export const getCountryByCode = async (req: Request, res: Response): Promise<any> => {
    try {
        const { code } = req.params;
        const country = await countryService.getCountryByCode(code.toUpperCase());

        if (!country) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Country not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: country,
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

export const updateCountry = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, slug, code } = req.body;

        // Validate country exists
        const existingCountry = await countryService.getCountryById(id);
        if (!existingCountry) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Country not found',
                context
            });
        }

        // Prepare update data
        const updateData = {
            name: name || existingCountry.name,
            slug: slug || existingCountry.slug,
            code: code ? code.toUpperCase() : existingCountry.code
        };

        // Check for code conflicts
        if (updateData.code !== existingCountry.code) {
            const codeConflict = await countryService.getCountryByCode(updateData.code);
            if (codeConflict) {
                return responseHandler(res, {
                    success: false,
                    statusCode: 409,
                    error: 'Country code exists',
                    details: 'Another country is using this code',
                    context
                });
            }
        }

        // Check for slug conflicts
        if (updateData.slug !== existingCountry.slug) {
            const slugConflict = await countryService.getCountryBySlug(updateData.slug);
            if (slugConflict) {
                return responseHandler(res, {
                    success: false,
                    statusCode: 409,
                    error: 'Slug exists',
                    details: 'Another country is using this slug',
                    context
                });
            }
        }

        const updatedCountry = await countryService.updateCountry(id, updateData);

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Country updated successfully',
            result: updatedCountry,
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

export const deleteCountry = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const existingCountry = await countryService.getCountryById(id);
        if (!existingCountry) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Country not found',
                context
            });
        }

        await countryService.deleteCountry(id);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Country deleted successfully',
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
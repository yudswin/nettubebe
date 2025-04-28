import { Request, Response } from 'express';
import * as contentCountryService from "@services/contentCountry.service";
import { responseHandler } from '@libs/responseHelper';

const context = 'ContentCountryController';
export const addCountriesToContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const { countryIds } = req.body;

        if (!Array.isArray(countryIds)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid request format',
                details: 'Expected array of country IDs',
                context
            });
        }

        if (countryIds.some(id => typeof id !== 'string')) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid country data',
                details: 'All country IDs must be strings',
                context
            });
        }

        const uniqueIds = [...new Set(countryIds)];
        if (uniqueIds.length !== countryIds.length) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Duplicate countries',
                details: 'Cannot add the same country multiple times',
                context
            });
        }

        const result = await contentCountryService.addCountriesToContent(contentId, uniqueIds);
        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: `Added ${uniqueIds.length} countries to content`,
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

export const getCountriesForContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const countries = await contentCountryService.getCountriesForContent(contentId);
        if (!countries) {
            return responseHandler(res, {
                success: true,
                statusCode: 204,
                context
            });
        }
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

export const removeCountriesFromContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const { countryIds } = req.body;

        if (!Array.isArray(countryIds) || countryIds.length === 0) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid request format',
                details: 'Expected array of country IDs to remove',
                context
            });
        }

        await contentCountryService.removeCountriesFromContent(contentId, countryIds);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: `Removed ${countryIds.length} countries from content`,
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

export const setCountriesForContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const { countryIds } = req.body;

        if (!Array.isArray(countryIds)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid request format',
                details: 'Expected array of country IDs',
                context
            });
        }

        const uniqueIds = [...new Set(countryIds)];
        if (uniqueIds.length !== countryIds.length) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Duplicate countries',
                details: 'Cannot add the same country multiple times',
                context
            });
        }

        await contentCountryService.setCountriesForContent(contentId, uniqueIds);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: `Updated content countries with ${uniqueIds.length} entries`,
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
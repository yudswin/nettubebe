import { Request, Response } from 'express';
import * as departmentService from "@services/department.service";
import { responseHandler } from '@libs/responseHelper';
import { NewDepartment } from '@schema/sql/departments.schema';
import { nanoid } from 'nanoid';

const context = 'DepartmentController';

export const createDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, slug } = req.body;

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
        const existingSlug = await departmentService.getBySlug(slug);
        if (existingSlug) {
            return responseHandler(res, {
                success: false,
                statusCode: 409,
                error: 'Slug already exists',
                details: 'A department with this slug already exists',
                context
            });
        }

        const departmentData: NewDepartment = {
            _id: nanoid(12),
            name,
            slug
        };

        const createdDepartment = await departmentService.createDepartment(departmentData);

        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: `Department created: ${createdDepartment?.name}`,
            result: createdDepartment,
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

export const getAllDepartments = async (req: Request, res: Response): Promise<any> => {
    try {
        const departments = await departmentService.getAllDepartment();
        return responseHandler(res, {
            success: true,
            statusCode: departments.length > 0 ? 200 : 204,
            result: departments,
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

export const getDepartmentById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const department = await departmentService.getById(id);

        if (!department) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Department not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: department,
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

export const getDepartmentBySlug = async (req: Request, res: Response): Promise<any> => {
    try {
        const { slug } = req.params;
        const department = await departmentService.getBySlug(slug);

        if (!department) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Department not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: department,
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

export const updateDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;

        // Check existing department
        const existingDepartment = await departmentService.getById(id);
        if (!existingDepartment) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Department not found',
                context
            });
        }

        // Prepare update data
        const updateData = {
            name: name || existingDepartment.name,
            slug: slug || existingDepartment.slug
        };

        // Check for slug conflicts
        if (updateData.slug !== existingDepartment.slug) {
            const slugConflict = await departmentService.getBySlug(updateData.slug);
            if (slugConflict) {
                return responseHandler(res, {
                    success: false,
                    statusCode: 409,
                    error: 'Slug already exists',
                    details: 'Another department is using this slug',
                    context
                });
            }
        }

        const updatedDepartment = await departmentService.updateDepartment(id, updateData);

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Department updated successfully',
            result: updatedDepartment,
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

export const deleteDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const existingDepartment = await departmentService.getById(id);
        if (!existingDepartment) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Department not found',
                context
            });
        }

        await departmentService.deleteDepartment(id);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Department deleted successfully',
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

export const searchDepartment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { q, page = 1, limit = 5 } = req.query
        if (!q || typeof q !== 'string') {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Search query is required',
                context
            });
        }

        const results = await departmentService.searchDepartment(q, Number(page), Number(limit));

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
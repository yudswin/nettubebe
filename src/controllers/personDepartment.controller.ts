import { Request, Response } from 'express';
import { responseHandler } from '@libs/responseHelper';
import * as personDepartmentService from '@services/personDepartment.service';

const context = 'PersonDepartmentController';

export const addDepartmentsToPerson = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id: personId } = req.params;
        const { departmentIds } = req.body;

        // Validation
        if (!Array.isArray(departmentIds) || departmentIds.length === 0) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid department IDs',
                context
            });
        }

        const result = await personDepartmentService.addDepartmentsToPerson(
            personId,
            departmentIds
        );

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Departments added to person',
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

export const getPersonDepartments = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id: personId } = req.params;
        const departments = await personDepartmentService.getPersonDepartments(personId);
        
        return responseHandler(res, {
            success: true,
            statusCode: 200,
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

export const removeDepartmentsFromPerson = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id: personId } = req.params;
        const { departmentIds } = req.body;

        if (!Array.isArray(departmentIds) || departmentIds.length === 0) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid department IDs',
                context
            });
        }

        const result = await personDepartmentService.removeDepartmentsFromPerson(
            personId,
            departmentIds
        );

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Departments removed from person',
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

export const setPersonDepartments = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id: personId } = req.params;
        const { departmentIds } = req.body;

        if (!Array.isArray(departmentIds)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid department IDs',
                context
            });
        }

        const result = await personDepartmentService.setPersonDepartments(
            personId,
            departmentIds
        );

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Person departments updated',
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
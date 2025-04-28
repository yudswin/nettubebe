import { decodeToken, generateAuthTokens } from '@libs/jwtUtils';
import { Request, Response } from 'express';
import * as userService from "@services/user.service"
import { hashPassword, verifyPassword } from '@libs/bcryptUtils';
import { responseHandler } from '@libs/responseHelper';
import { NewUser } from '@schema/sql/users.schema';
import { nanoid } from 'nanoid';

const context = 'UserController'
export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, name, password } = req.body;

        // Check if required fields are missing
        if (!email || !name || !password) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required fields',
                details: {
                    email: email ? undefined : 'Email is required',
                    name: name ? undefined : 'Name is required',
                    password: password ? undefined : 'Password is required'
                },
                context
            });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid email format',
                context
            });
        }

        // Validate password strength
        if (password.length < 8) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid email format',
                details: 'Password must be at least 8 characters long',
                context
            });
        }

        const hashedPassword = await hashPassword(password);
        const userData: NewUser = {
            _id: nanoid(12),
            email: email,
            name: name,
            password: hashedPassword,
        }

        // Check existed account
        const existed = await userService.getByEmail(email);
        if (existed) {
            return responseHandler(res, {
                success: false,
                statusCode: 409,
                error: 'User already exists',
                details: 'A user with this email address already exists',
                context
            });
        }
        const createdUser = await userService.createUser(userData);

        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: `User account created successfully: ${createdUser?.email}`,
            result: {
                email: createdUser?.email,
                name: createdUser?.name
            },
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

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        // Check if required fields are missing
        if (!email || !password) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required fields',
                details: {
                    email: email ? undefined : 'Email is required',
                    password: password ? undefined : 'Password is required'
                },
                context
            });
        }

        // Check existed account
        const existed = await userService.getByEmail(email);
        if (!existed) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'User does not exists',
                details: {
                    error: 'User does not exists',
                    details: 'A user with this email address have not exists in the system'
                },
                context
            });
        }

        // Verify the password
        const verify = await verifyPassword(password, existed.password)
        if (!verify) {
            responseHandler(res, {
                success: false,
                statusCode: 401,
                error: 'Wrong password',
                details: {
                    error: 'User does not exists',
                    details: 'Password does not match for this user'
                },
                context
            });
        }

        // Auth user into system (token provided)
        const { accessToken, refreshToken } = generateAuthTokens(
            existed._id,
            existed.email,
            existed.roles,
        )

        const result = await userService.updateUser(existed._id, {
            token: refreshToken
        });
        if (!result) {
            return responseHandler(res, {
                success: false,
                statusCode: 500,
                error: 'Failed to update token',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            details: {
                accessToken,
                refreshToken
            },
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

export const getUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await userService.getUsers();
        if (result) return responseHandler(res, {
            success: true,
            statusCode: result?.length > 1 ? 200 : 204,
            result,
            context
        });
    } catch (error) {
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            error: 'Internal server error.',
            details: error instanceof Error ? error.message : 'Unknown error',
            context
        });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            password,
            avatarId,
            token,
            gender
        } = req.body

        if (!name && !email && !password && !avatarId && !token && !gender) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required fields',
                context
            });
        }

        await userService.updateUser(id, req.body);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'User information updated.',
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

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'User deleted.',
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

export const getSelf = async (req: Request, res: Response): Promise<any> => {
    try {
        const { newAccessToken, accesstoken } = req.headers as {
            newAccessToken: string,
            accesstoken: string
        }
        const token = newAccessToken || accesstoken;
        if (token) {
            const decoded = decodeToken(token)
            if (decoded) {
                const user = await userService.getByEmailWithoutPass(decoded.email);
                return responseHandler(res, {
                    success: true,
                    statusCode: 200,
                    result: {
                        user
                    },
                    context
                });
            }
        }
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
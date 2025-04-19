import { decodeToken, generateAuthTokens } from '@libs/jwtUtils';
import { Request, Response } from 'express';
import * as userService from "@services/user.service"
import { hashPassword, verifyPassword } from '@libs/bcryptUtils';
import logger from "@libs/logUtils";
import * as statusReturn from "@middleware/handler/tokenStatus";


export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        logger.debug('Creating user', 'UserController');
        const { email, username, password } = req.body;

        // Check if required fields are missing
        if (!email || !username || !password) {
            logger.warn('Missing required fields', 'UserController');
            return res.status(400).json({
                error: 'Missing required fields',
                details: {
                    email: email ? undefined : 'Email is required',
                    username: username ? undefined : 'Username is required',
                    password: password ? undefined : 'Password is required'
                }
            });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            logger.warn('Invalid email format', 'UserController');
            return res.status(400).json({
                error: 'Invalid email format'
            });
        } 
        // Validate password strength
        if (password.length < 8) {
            logger.warn('Week password format', 'UserController');
            return res.status(400).json({
                error: 'Password too weak',
                details: 'Password must be at least 8 characters long'
            });
        }

        // Hash user account password
        const hashedPassword = await hashPassword(password);
        const userData = {
            email: email,
            username: username,
            password: hashedPassword,
        }

        // Check existed account
        const existed = await userService.getByEmail(userData.email);
        if (existed) {
            logger.warn('User already exists', 'UserController');
            return res.status(409).json({
                error: 'User already exists',
                details: 'A user with this email address already exists'
            });
        }

        const createdUser = await userService.createUser(userData);
        logger.info(`User created: ${email}`, 'UserController');

        return res.status(201).json({
            detail: `User account created successfully: ${createdUser?.email}`
        });
    } catch (error) {
        logger.error(`Error creating user: ${error}`, 'UserController');
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        logger.debug('Logging user', 'UserController');
        const { email, password } = req.body;

        // Check if required fields are missing
        if (!email || !password) {
            logger.warn('Missing required fields', 'UserController');
            return res.status(400).json({
                error: 'Missing required fields',
                details: {
                    email: email ? undefined : 'Email is required',
                    password: password ? undefined : 'Password is required'
                }
            });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            logger.warn('Invalid email format', 'UserController');
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        const userData = {
            email: email,
            password: password
        }

        // Check existed account
        const existed = await userService.getByEmail(userData.email);
        if (!existed) {
            logger.warn('User does not exists', 'UserController');
            return res.status(401).json({
                error: 'User does not exists',
                details: 'A user with this email address have not exists in the system'
            });
        }

        // Verify the password
        const verify = await verifyPassword(userData.password, existed.password)
        if (!verify) {
            logger.warn('Wrong password', 'UserController');
            return res.status(401).json({
                error: 'Wrong password',
                details: 'Password does not match for this user'
            });
        }

        // Auth user into system (token provided)
        const { accessToken, refreshToken } = generateAuthTokens(
            existed?.email,
            existed?.role,
        )

        const result = await userService.updateUser(existed.id, {
            refreshToken
        });
        if (!result) {
            logger.error('Error at updating user tokens', 'UserController');
            return res.status(500).json({
                error: 'Failed to update token',
            });
        }
        logger.info(`User logged in: ${email}`, 'UserController');
        logger.info(`accessToken: ${accessToken}`, 'UserController');
        logger.info(`accessToken: ${refreshToken}`, 'UserController');

        return res.status(200).json({
            details: {
                email,
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await userService.getUsers();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const result = await userService.updateUser(Number(id), req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const result = await userService.deleteUser(Number(id));
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getSelf = async (req: Request, res: Response): Promise<void> => {
    try {
        const { accesstoken, refreshtoken } = req.headers as {
            accesstoken?: string;
            refreshtoken?: string;
        };

        if (!accesstoken && !refreshtoken) {
            logger.warn('Access token and refresh token missing', 'getSelf');
            statusReturn.missingTokens(res);
            return;
        }

        const token = accesstoken || refreshtoken;
        const decoded = token ? decodeToken(token) : null;

        if (!decoded?.email) {
            logger.warn('Invalid or malformed token', 'getSelf');
            statusReturn.invalidAccessToken(res);
            return;
        }

        const user = await userService.getByEmailWithoutPass(decoded.email);
        res.json(user);

    } catch (error) {
        logger.error(`Error in getSelf: ${error instanceof Error ? error.message : String(error)}`);
        res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
import { Request, Response } from 'express';
import * as userService from "@services/user.service"

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, age, email } = req.body;
        console.log(req.body);
        const result = await userService.createUser(name, age, email);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log(error);
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getUsers();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log(error);
    }
};

export const updateUser = async (req: Request, res: Response) => {
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

export const deleteUser = async (req: Request, res: Response) => {
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
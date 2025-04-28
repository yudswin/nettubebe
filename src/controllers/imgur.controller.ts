import { imgurClient } from '@db/imgurClient';
import { Request, Response } from 'express';
import * as userService from "@services/user.service"
import * as avatarService from "@services/avatar.service"
import { verifyEmailFromHeaders } from '@middleware/auth';
import { responseHandler } from '@libs/responseHelper';
import { NewImage } from '@schema/sql/imgs.schema';
import { nanoid } from 'nanoid';
import { decodeToken } from '@libs/jwtUtils';

const context = "ImgurController"
export const uploadAvatar = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.file) {
            const result = await verifyEmailFromHeaders(req, res);
            if (result.success) {
                const imgurResponse = await imgurClient.uploadImage(
                    req.file.buffer,
                    req.file.originalname,
                )
                if (!imgurResponse.success) {
                    return responseHandler(res, {
                        success: false,
                        statusCode: 502,
                        error: 'User does not exists',
                        details: {
                            error: 'Image hosting failed',
                            details: imgurResponse.data
                        },
                        context
                    });
                }
                const avatarData: NewImage = {
                    _id: nanoid(12),
                    imgurId: imgurResponse.data.id,
                    deleteHash: imgurResponse.data.deletehash,
                    path: imgurResponse.data.link,
                    type: 'avatar',
                    metadata: {
                        width: imgurResponse.data.width,
                        height: imgurResponse.data.height,
                        size: req.file.size
                    }
                }
                const storeAvatar = await avatarService.createAvatarRecord(avatarData)
                if (!storeAvatar) {
                    return responseHandler(res, {
                        success: false,
                        statusCode: 502,
                        error: 'Avatar record stored failed.',
                        details: imgurResponse.data,
                        context
                    });
                }
                const updateUserAvatar = await userService.updateUser(result.user._id, { avatarId: storeAvatar._id })
                if (!updateUserAvatar) {
                    return responseHandler(res, {
                        success: false,
                        statusCode: 502,
                        error: 'Avatar stored failed to user.',
                        details: imgurResponse.data,
                        context
                    });
                }
                return responseHandler(res, {
                    success: true,
                    statusCode: 200,
                    message: 'User avatar updated.',
                    result: {
                        avatarUrl: imgurResponse.data.link,
                    },
                    context
                })
            }
        } else {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'No image file provided',
                context
            });
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
}

export const deleteAvatar = async (req: Request, res: Response): Promise<any> => {
    try {
        const { newAccessToken, accesstoken } = req.headers as {
            newAccessToken: string,
            accesstoken: string
        }
        const token = newAccessToken || accesstoken;
        if (!token) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing tokens fields',
                context
            });
        }
        const decoded = decodeToken(token)
        if (!decoded) {
            return responseHandler(res, {
                success: false,
                statusCode: 401,
                error: 'Invalid or expired token.',
                context
            });
        }

        const existed = await userService.getById(decoded.id);
        if (!existed) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'User does not exists.',
                context
            });
        }

        if (!existed.avatarId) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'User does not have any avatar exists.',
                context
            });
        }

        const avatar = await avatarService.getAvatarRecord(existed.avatarId)
        if (!avatar) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Avatar does not exists.',
                context
            });
        }

        const imgurDelete = await imgurClient.deleteImage(avatar.deleteHash)
        if (!imgurDelete) {
            return responseHandler(res, {
                success: false,
                statusCode: 501,
                error: 'Imgur delete error.',
                details: imgurClient,
                context
            });
        }

        
        const userAvatarDelete = await avatarService.deleteAvatar(avatar._id)
        if (!userAvatarDelete) {
            return responseHandler(res, {
                success: false,
                statusCode: 500,
                error: 'Database delete error.',
                details: imgurClient,
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Avatar deleted.',
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
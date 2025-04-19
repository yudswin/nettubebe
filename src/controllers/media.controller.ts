import { imgurClient } from '@db/imgurClient';
import { Request, Response } from 'express';
import { decodeToken } from "@libs/jwtUtils";
import logger from "@libs/logUtils";
import * as statusReturn from "@middleware/handler/tokenStatus";
import * as userService from "@services/user.service"
import * as mediaService from "@services/media.service"


export const uploadAvatar = async (req: Request, res: Response): Promise<any> => {
    try {
        const { accesstoken, refreshtoken } = req.headers as {
            accesstoken?: string;
            refreshtoken?: string;
        };

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }

        if (!accesstoken && !refreshtoken) {
            logger.warn('Access token and refresh token missing', 'getSelf');
            return statusReturn.missingTokens(res);
        }

        const token = accesstoken || refreshtoken;
        const decoded = token ? decodeToken(token) : null;
        if (!decoded?.email) {
            logger.warn('Invalid or malformed token', 'getSelf');
            return statusReturn.invalidAccessToken(res);
        }

        const existed = await userService.getByEmail(decoded.email);
        if (!existed) {
            logger.warn('User does not exists', 'UserController');
            return res.status(401).json({
                error: 'User does not exists',
                details: 'A user with this email address have not exists in the system'
            });
        }

        const imgurResponse = await imgurClient.uploadImage(
            req.file.buffer,
            req.file.originalname,
            `Avatar for ${existed.email}`,
        )

        if (!imgurResponse.success) {
            return res.status(502).json({
                success: false,
                error: 'Image hosting failed',
                details: imgurResponse.data
            });
        }

        const avatarData = {
            userId: existed.id,
            imgurId: imgurResponse.data.id,
            deletehash: imgurResponse.data.deletehash,
            url: imgurResponse.data.link,
            type: 'avatar',
            metadata: {
                width: imgurResponse.data.width,
                height: imgurResponse.data.height,
                size: req.file.size
            }
        }
        const storeAvatar = await mediaService.createAvatarRecord(avatarData)
        if (!storeAvatar) {
            return res.status(502).json({
                success: false,
                error: 'Avatar stored failed to user',
                details: imgurResponse.data
            });
        }

        const updateUserAvatar = await userService.updateUser(existed.id, { avatarId: storeAvatar.id })
        if (!updateUserAvatar) {
            return res.status(502).json({
                success: false,
                error: 'Avatar stored failed to user',
                details: imgurResponse.data
            });
        }

        return res.json({
            success: true,
            avatarUrl: imgurResponse.data.link,
            metadata: {
                id: storeAvatar.id,
                uploadedAt: storeAvatar.createdAt,
                dimensions: {
                    width: imgurResponse.data.width,
                    height: imgurResponse.data.height
                }
            }
        });

    } catch (error) {
        logger.error(`Error in getSelf: ${error instanceof Error ? error.message : String(error)}`);
        return res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
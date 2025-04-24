import { imgurClient } from '@db/imgurClient';
import { Request, Response } from 'express';
import logger from "@libs/logUtils";
import * as statusReturn from "@middleware/handler/tokenStatus";
import * as userService from "@services/user.service"
import * as avatarService from "@services/avatar.service"
import { verifyEmailFromHeaders } from '@middleware/auth';


export const uploadAvatar = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }
        const result = await verifyEmailFromHeaders(req, res); // pass true if image required
        if (!result.success) {
            logger.warn('Invalid or malformed token', 'getSelf');
            return statusReturn.invalidAccessToken(res);
        }

        const decoded = result.response;
        if (!decoded?.email) {
            logger.warn('Invalid or malformed token', 'getSelf');
            return statusReturn.invalidAccessToken(res);
        }

        const imgurResponse = await imgurClient.uploadImage(
            req.file.buffer,
            req.file.originalname,
            `Avatar for ${decoded.email}`,
        )

        if (!imgurResponse.success) {
            return res.status(502).json({
                success: false,
                error: 'Image hosting failed',
                details: imgurResponse.data
            });
        }

        const avatarData = {
            userId: decoded.id,
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
        const storeAvatar = await avatarService.createAvatarRecord(avatarData)
        if (!storeAvatar) {
            return res.status(502).json({
                success: false,
                error: 'Avatar stored failed to user',
                details: imgurResponse.data
            });
        }

        const updateUserAvatar = await userService.updateUser(decoded.id, { avatarId: storeAvatar.id })
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
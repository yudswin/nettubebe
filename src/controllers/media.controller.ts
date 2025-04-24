import logger from '@libs/logUtils';
import { Request, Response } from 'express';
import * as mediaService from "@services/media.service"
import * as cloudService from "@services/cloudinary.service"
import { generateUUIDv2 } from '@libs/uuidUtils';

export const uploadVideo = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file?.buffer) {
            return res.status(400).json({
                success: false,
                error: 'Invalid file upload'
            });
        }
        const fileBuffer = req.file.buffer;
        if (!req.file?.buffer) {
            return res.status(500).json({
                success: false,
                error: 'FileBuffer Problem'
            });
        }

        const title = req.file.originalname || "untitled";
        const recordData = {
            mediaId: generateUUIDv2(title),
            title: title
        };

        const storeRecord = await mediaService.createMediaRecord(recordData);
        if (!storeRecord) {
            return res.status(502).json({
                success: false,
                error: 'Database storage failed',
                details: recordData
            });
        }

        const storeCloudinary = await cloudService.uploadMedia(
            fileBuffer,
            storeRecord.mediaId
        );

        if (!storeCloudinary) {
            return res.status(502).json({
                success: false,
                error: 'Cloudinary upload failed',
                details: recordData
            });
        }

        return res.json({
            success: true,
            data: {
                mediaId: storeRecord.mediaId
            }
        });

    } catch (error) {
        logger.error(`Upload failed: ${error}`, 'MediaController');
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
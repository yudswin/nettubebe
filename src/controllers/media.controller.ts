import { audioType } from './../models/mysql/media.schema';
import { Request, Response } from 'express';
import * as mediaService from "@services/media.service"
import * as cloudService from "@services/cloudinary.service"
import { generateUUIDv2 } from '@libs/uuidUtils';
import { responseHandler } from '@libs/responseHelper';
import { NewMedia } from '@schema/sql/media.schema';
import { nanoid } from 'nanoid';

const context = "MediaController"
export const uploadVideo = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid file upload',
                context
            });
        }
        const fileBuffer = req.file.buffer;
        if (!fileBuffer) {
            return responseHandler(res, {
                success: false,
                statusCode: 500,
                error: 'FileBuffer Problem',
                context
            });
        }
        const { contentId } = req.params
        const title = req.file.originalname || "untitled";
        const recordData: NewMedia = {
            _id: nanoid(12),
            publicId: generateUUIDv2(title),
            title: title,
            audioType: audioType[1],
            contentId: contentId
        };
        const storeRecord = await mediaService.createMediaRecord(recordData);
        if (!storeRecord) {
            return responseHandler(res, {
                success: false,
                statusCode: 502,
                error: 'Database storage failed',
                context
            });
        }
        const storeCloudinary = await cloudService.uploadMedia(
            fileBuffer,
            storeRecord.publicId
        );
        if (!storeCloudinary) {
            return responseHandler(res, {
                success: false,
                statusCode: 502,
                error: 'Cloudinary upload failed',
                context
            });
        }
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: storeRecord,
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

export const getVideoRecord = async (req: Request, res: Response): Promise<any> => {
    try {
        const { mediaId } = req.params
        if (!mediaId) {
            return responseHandler(res, {
                success: true,
                statusCode: 400,
                error: 'mediaId is Required',
                context
            })
        }
        const result = await mediaService.getMediaRecord(mediaId)
        if (result) return responseHandler(res, {
            success: true,
            statusCode: 200,
            result,
            context
        })
    } catch (error) {
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            error: 'Internal server error.',
            details: error instanceof Error ? error.message : 'Unknown error',
            context
        });
    }
}

export const getMediaByContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params
        if (!contentId) {
            return responseHandler(res, {
                success: true,
                statusCode: 400,
                error: 'contentId is Required',
                context
            })
        }
        const result = await mediaService.getMediaByContent(contentId)
        if (result) return responseHandler(res, {
            success: true,
            statusCode: 200,
            result,
            context
        })
    } catch (error) {
        return responseHandler(res, {
            success: false,
            statusCode: 500,
            error: 'Internal server error.',
            details: error instanceof Error ? error.message : 'Unknown error',
            context
        });
    }
}




export const updateRecord = async (req: Request, res: Response): Promise<any> => {
    try {
        const { mediaId } = req.params
        const {
            episode,
            season,
            title,
            audioType
        } = req.body
        if (!mediaId) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'mediaId is required.',
                context
            })
        }
        if (!episode && !season && !title && !audioType) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing update field.',
                context
            })
        }
        await mediaService.updataRecord(mediaId, req.body)
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Media information updated.',
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

export const deleteMedia = async (req: Request, res: Response): Promise<any> => {
    try {
        const { mediaId } = req.params
        if (!mediaId) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'mediaId is required.',
                context
            })
        }
        const existed = await mediaService.getMediaRecord(mediaId)
        if (!existed) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Media with given id does not exists.',
                context
            });
        }
        const cloudResult = await cloudService.deleteMedia(existed.publicId)
        if (!cloudResult) {
            return responseHandler(res, {
                success: false,
                statusCode: 500,
                error: 'Cloudinary service error occurs.',
                context
            });
        }
        const dbResult = await mediaService.deleteRecord(existed._id)
        if (!dbResult) {
            return responseHandler(res, {
                success: false,
                statusCode: 500,
                error: 'Database service error occurs.',
                context
            });
        }
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Media deleted.',
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
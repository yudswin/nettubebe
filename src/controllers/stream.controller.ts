import { Request, Response } from 'express';
import * as streamService from '@services/stream.service';
import * as mediaService from '@services/media.service'
import logger from '@libs/logUtils';
import { responseHandler } from '@libs/responseHelper';

const context = "StreamingController"
export const getStreamingUrls = async (req: Request, res: Response): Promise<any> => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'videoId is required'
            })
        }

        const existedMedia = await mediaService.getMediaRecord(videoId)
        if (!existedMedia) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Media with given id does not existed.'
            })
        }

        const urls = await streamService.getStreamingUrls({
            publicId: `${existedMedia.publicId}`,
            expiresAt: req.query.expiresAt
                ? parseInt(req.query.expiresAt as string)
                : undefined
        });

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: urls
        })
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

export const proxyManifest = async (req: Request, res: Response): Promise<any> => {
    try {
        const { videoId } = req.params;

        // Remove 'res' parameter from service call
        const manifest = await streamService.getManifest(
            `${videoId}`,
            req.query.format as 'hls' | 'dash'
        );
        if (!manifest) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch manifest'
            });
        }

        res.set('Content-Type', req.query.format === 'hls'
            ? 'application/vnd.apple.mpegurl'
            : 'application/dash+xml')
            .send(manifest.content);
    } catch (error) {
        logger.warn(`Error Streaming: ${error}`, 'StreamController');

        // Handle generic errors
        res.status(500).json({
            success: false,
            error: 'Failed to fetch manifest'
        });
    }
};

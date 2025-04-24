import { Request, Response } from 'express';
import * as streamService from '@services/stream.service';
import logger from '@libs/logUtils';

export const getStreamingUrls = async (req: Request, res: Response) => {
    try {
        const { videoId } = req.params;

        const urls = await streamService.getStreamingUrls({
            publicId: `${videoId}`,
            expiresAt: req.query.expiresAt
                ? parseInt(req.query.expiresAt as string)
                : undefined
        });

        res.json({
            success: true,
            data: urls
        });
    } catch (error) {
        logger.warn(`Error Streaming:  ${error}`, 'StreamController')
        res.status(500).json({
            success: false,
            error: 'Failed to get streaming URLs'
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

import cloudinary from "@db/cloudinaryConfig";
import { GetStreamingUrlParams } from "@interfaces/streaming.types";
import logger from "@libs/logUtils";

export const getStreamingUrls = async (params: GetStreamingUrlParams) => {
    try {
        const { publicId, expiresAt } = params;

        // Generate secure URL with expiration
        const baseOptions = {
            resource_type: 'video',
            sign_url: true,
            secure: true,
            expires_at: expiresAt ?? Math.floor(Date.now() / 1000) + 3600, // 1 hour default
        };

        return {
            hls: cloudinary.url(publicId, {
                ...baseOptions,
                streaming_profile: 'hd',
                format: 'm3u8',
                transformation: [
                    { quality: 'auto', width: 1920, height: 1080 },
                    { quality: 'auto', width: 1280, height: 720 },
                    { quality: 'auto', width: 854, height: 480 }
                ]
            })
        };
    } catch (error) {
        logger.warn(`Failed to generate streaming URLs:  ${error}`, 'StreamService')
    }
}

export const generatePreviewSprite = async (publicId: string) => {
    return cloudinary.url(publicId, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [
            { duration: '10', start_offset: '0' }, // Generate from first 10 seconds
            { crop: 'thumb', width: 120, height: 80 },
            { columns: 10, rows: 1, tile: '10x1' } // 10 thumbnails in 1 row
        ]
    });
}

export const getManifest = async (publicId: string, format: 'hls' | 'dash') => {
    const manifestUrl = cloudinary.url(publicId, {
        resource_type: 'video',
        format: format === 'hls' ? 'm3u8' : 'mpd',
        streaming_profile: 'hd',
        sign_url: true,
        secure: true
    });

    try {
        const response = await fetch(manifestUrl);
        return {
            url: manifestUrl,
            content: await response.text()
        };
    } catch (error) {
        logger.warn(`Stream manifest not found:  ${error}`, 'StreamService')
    }
}
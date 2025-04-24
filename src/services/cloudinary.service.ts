import cloudinary from "@db/cloudinaryConfig"
import { Readable } from 'stream';

export const uploadMedia = async (
    fileBuffer: Buffer,
    publicId: string
) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'video',
                public_id: publicId,
                chunk_size: 64 * 1024 * 1024,
                eager: [
                    {
                        format: 'm3u8',
                        streaming_profile: 'hd',
                        transformation: [
                            { width: 1920, height: 1080, crop: 'limit' },
                            { width: 1280, height: 720, crop: 'limit' }
                        ]
                    }
                ],
                eager_async: true,
                overwrite: true
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );

        // Convert buffer to readable stream
        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null); 
        readableStream.pipe(uploadStream);
    });
}
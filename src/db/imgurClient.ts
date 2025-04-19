import FormData from 'form-data';
import axios from "axios";
import { ImgurResponse } from "src/interfaces/media.interface";
import dotenv from "dotenv";

dotenv.config()

class ImgurClient {
    private readonly clientId: string

    constructor(clientId: string) {
        if (!clientId) throw new Error('IMGUR_CLIENTID is not configured');
        this.clientId = process.env.IMGUR_CLIENTID || clientId;
    }

    async uploadImage(imageBuffer: Buffer, filename: string, title?: string, description?: string): Promise<ImgurResponse> {
        const formData = new FormData();
        formData.append('image', imageBuffer, {
            filename: filename,
            contentType: 'application/octet-stream'
        });

        if (title) formData.append('title', title);
        if (description) formData.append('description', description);

        formData.append('type', 'image')
        try {
            const response = await axios.post<ImgurResponse>(
                'https://api.imgur.com/3/image',
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        Authorization: `Client-ID ${this.clientId}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Imgur upload failed: ${error.response?.data?.data?.error || error.message}`);
            }
            throw new Error('Unknown error during Imgur upload');
        }
    }
}

export const imgurClient = new ImgurClient(process.env.IMGUR_CLIENTID!);

export interface ImgurResponse {
    data: {
        id: string;
        deletehash: string;
        link: string;
        type: string;
        width: number;
        height: number;
        size: number;
    };
    success: boolean;
    status: number;
}

export interface ImageRecord {
    id: number;
    imgur_id: string;
    deletehash: string;
    url: string;
    title?: string;
    description?: string;
    upload_date: Date;
}
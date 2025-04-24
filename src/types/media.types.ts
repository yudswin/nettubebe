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

export type ResponseParams = {
    success: boolean;
    statusCode: number;
    message?: string;
    error?: string | null;
    details?: any;
    result?: any;
    context?: string;
};
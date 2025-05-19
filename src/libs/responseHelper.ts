import { ResponseParams } from "@interfaces/response.types";
import { Response } from 'express';
import logger from "./logUtils";

const DEFAULT_MESSAGES = {
    success: 'Thành công!',
    error: 'Không thành công!'
};

export const responseHandler = (
    res: Response,
    params: ResponseParams
): Response => {
    const {
        success,
        statusCode,
        message,
        error = null,
        details = null,
        result = null,
        context = 'Application' 
    } = params;

    const baseMessage = success ? DEFAULT_MESSAGES.success : DEFAULT_MESSAGES.error;
    let fullMessage = message ? `${baseMessage} ${message}` : baseMessage;

    if (error) {
        fullMessage += ` Error: ${error}`;
    }

    if (!success) {
        if (statusCode >= 500) {
            logger.error(fullMessage, context);
        } else if (statusCode >= 400) {
            logger.warn(fullMessage, context);
        }
    } else {
        logger.info(fullMessage, context);
    }

    return res.status(statusCode).json({
        status: success ? 'success' : 'failed',
        msg: fullMessage,
        ...(details && { details }),
        ...(result && { result }),
    });
};
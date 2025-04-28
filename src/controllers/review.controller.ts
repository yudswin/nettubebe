import { Request, Response } from 'express';
import * as reviewService from "@services/review.service";
import { responseHandler } from '@libs/responseHelper';
import { NewReview } from '@schema/sql/reviews.schema';
import { nanoid } from 'nanoid';

const context = 'ReviewController';

const validateRating = (rating: string) => {
    const numericRating = parseFloat(rating);
    return !isNaN(numericRating) && numericRating >= 0 && numericRating <= 5;
};

export const createReview = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, contentId, comment, rating } = req.body;

        // Validate required fields
        if (!userId || !contentId || !comment || !rating) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Missing required fields',
                details: {
                    userId: !userId ? 'User ID is required' : undefined,
                    contentId: !contentId ? 'Content ID is required' : undefined,
                    comment: !comment ? 'Comment is required' : undefined,
                    rating: !rating ? 'Rating is required' : undefined
                },
                context
            });
        }

        // Validate rating format
        if (!validateRating(rating)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid rating',
                details: 'Rating must be between 0.0 and 5.0',
                context
            });
        }

        const reviewData: NewReview = {
            _id: nanoid(12),
            userId,
            contentId,
            comment,
            rating,
            reviewAt: new Date() // Will be set by DB default
        };

        const createdReview = await reviewService.createReview(reviewData);

        return responseHandler(res, {
            success: true,
            statusCode: 201,
            message: 'Review created successfully',
            result: createdReview,
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
};

export const getReview = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const review = await reviewService.getReviewById(id);

        if (!review) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Review not found',
                context
            });
        }

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            result: review,
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
};

export const getUserReviews = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const reviews = await reviewService.getReviewsByUser(userId);

        return responseHandler(res, {
            success: true,
            statusCode: reviews.length > 0 ? 200 : 204,
            result: reviews,
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
};

export const getContentReviews = async (req: Request, res: Response): Promise<any> => {
    try {
        const { contentId } = req.params;
        const reviews = await reviewService.getReviewsByContent(contentId);

        return responseHandler(res, {
            success: true,
            statusCode: reviews.length > 0 ? 200 : 204,
            result: reviews,
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
};

export const updateReview = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { comment, rating } = req.body;

        const existingReview = await reviewService.getReviewById(id);
        if (!existingReview) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Review not found',
                context
            });
        }

        // Validate rating if provided
        if (rating && !validateRating(rating)) {
            return responseHandler(res, {
                success: false,
                statusCode: 400,
                error: 'Invalid rating',
                details: 'Rating must be between 0.0 and 5.0',
                context
            });
        }

        const updateData = {
            comment: comment || existingReview.comment,
            rating: rating || existingReview.rating
        };

        const updatedReview = await reviewService.updateReview(id, updateData);

        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Review updated successfully',
            result: updatedReview,
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
};

export const deleteReview = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const existingReview = await reviewService.getReviewById(id);
        if (!existingReview) {
            return responseHandler(res, {
                success: false,
                statusCode: 404,
                error: 'Review not found',
                context
            });
        }

        await reviewService.deleteReview(id);
        return responseHandler(res, {
            success: true,
            statusCode: 200,
            message: 'Review deleted successfully',
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
};

export const getAllReviews = async (req: Request, res: Response): Promise<any> => {
    try {
        const reviews = await reviewService.getAllReviews();
        return responseHandler(res, {
            success: true,
            statusCode: reviews.length > 0 ? 200 : 204,
            result: reviews,
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
};
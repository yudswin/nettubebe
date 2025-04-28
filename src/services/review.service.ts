import { getDB } from "@db/client";
import { reviews, NewReview } from "@schema/sql/reviews.schema";
import { eq } from "drizzle-orm";

export const createReview = async (reviewData: NewReview) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.insert(reviews)
            .values(reviewData)
            .execute();
        return getReviewById(reviewData._id);
    } else {
        console.log("Haven't implemented createReview");
    }
};

export const getReviewById = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [review] = await db.client.select()
            .from(reviews)
            .where(eq(reviews._id, id))
            .execute();
        return review;
    } else {
        console.log("Haven't implemented getReviewById");
    }
};

export const getReviewsByUser = async (userId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(reviews)
            .where(eq(reviews.userId, userId))
            .execute();
    } else {
        console.log("Haven't implemented getReviewsByUser");
        return [];
    }
};

export const getReviewsByContent = async (contentId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(reviews)
            .where(eq(reviews.contentId, contentId))
            .execute();
    } else {
        console.log("Haven't implemented getReviewsByContent");
        return [];
    }
};

export const getAllReviews = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(reviews)
            .execute();
    } else {
        console.log("Haven't implemented getAllReviews");
        return [];
    }
};

export const updateReview = async (
    id: string,
    updateData: Partial<{
        comment: string;
        rating: string;
    }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.update(reviews)
            .set(updateData)
            .where(eq(reviews._id, id))
            .execute();
        return getReviewById(id);
    } else {
        console.log("Haven't implemented updateReview");
        return null;
    }
};

export const deleteReview = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.delete(reviews)
            .where(eq(reviews._id, id))
            .execute();
        return { success: true };
    } else {
        console.log("Haven't implemented deleteReview");
        return { success: false };
    }
};
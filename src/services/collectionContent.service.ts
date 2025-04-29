import { getDB } from "@db/client";
import { collectionContent } from "@schema/sql/collectionContent.schema";
import { and, eq } from "drizzle-orm";

export const addContentToCollection = async (
    collectionId: string,
    contentId: string,
    rank: number
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client
            .insert(collectionContent)
            .values({
                collectionId,
                contentId,
                rank,
                addedAt: new Date(),
            })
            .execute();
        return getCollectionContent(collectionId, contentId);
    }
};

export const getCollectionContent = async (
    collectionId: string,
    contentId: string
) => {
    const db = getDB();
    if (db.type === "mysql") {
        const result = await db.client
            .select()
            .from(collectionContent)
            .where(
                and(
                    eq(collectionContent.collectionId, collectionId),
                    eq(collectionContent.contentId, contentId)
                )
            )
            .execute();
        return result[0];
    }
};

export const getCollectionContents = async (collectionId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .select({
                contentId: collectionContent.contentId,
                rank: collectionContent.rank,
                addedAt: collectionContent.addedAt,
            })
            .from(collectionContent)
            .where(eq(collectionContent.collectionId, collectionId))
            .orderBy(collectionContent.rank)
            .execute();
    }
};

export const updateContentRank = async (
    collectionId: string,
    contentId: string,
    newRank: number
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client
            .update(collectionContent)
            .set({ rank: newRank })
            .where(
                and(
                    eq(collectionContent.collectionId, collectionId),
                    eq(collectionContent.contentId, contentId)
                )
            )
            .execute();
        return getCollectionContent(collectionId, contentId);
    }
};

export const removeContentFromCollection = async (
    collectionId: string,
    contentId: string
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client
            .delete(collectionContent)
            .where(
                and(
                    eq(collectionContent.collectionId, collectionId),
                    eq(collectionContent.contentId, contentId)
                )
            )
            .execute();
        return { success: true };
    }
};
import { getDB } from "@db/client";
import { collectionContent } from "@schema/sql/collectionContent.schema";
import { contents } from "@schema/sql/contents.schema";
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
                rank: collectionContent.rank,
                addedAt: collectionContent.addedAt,
                _id: collectionContent.contentId,
                title: contents.title,
                bannerPath: contents.bannerPath,
                year: contents.year,
                type: contents.type,
                publish: contents.publish,
                status: contents.status
            })
            .from(collectionContent)
            .where(eq(collectionContent.collectionId, collectionId))
            .leftJoin(contents, (eq(contents._id, collectionContent.contentId)))
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
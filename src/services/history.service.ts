import { getDB } from "@db/client";
import { contents } from "@schema/sql/contents.schema";
import { history, NewHistory } from "@schema/sql/history.schema";
import { media } from "@schema/sql/media.schema";
import { and, eq, inArray } from "drizzle-orm";

export const createHistory = async (historyData: NewHistory) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.insert(history)
            .values(historyData)
            .onDuplicateKeyUpdate({
                set: {
                    progress: historyData.progress,
                    watchedAt: new Date()
                }
            })
            .execute();
        return getHistoryEntry(historyData.userId, historyData.mediaId);
    } else {
        console.log("Haven't implemented createHistory");
    }
};

export const getHistoryEntry = async (userId: string, mediaId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [entry] = await db.client.select()
            .from(history)
            .where(and(
                eq(history.userId, userId),
                eq(history.mediaId, mediaId)
            ))
            .execute();
        return entry;
    } else {
        console.log("Haven't implemented getHistoryEntry");
    }
};

export const getUserHistory = async (userId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select({
            userId: history.userId,
            mediaId: history.mediaId,
            watchedAt: history.watchedAt,
            progress: history.progress,
            content: contents,
            media: media
        })
            .from(history)
            .where(eq(history.userId, userId))
            .leftJoin(media, eq(media._id, history.mediaId))
            .leftJoin(contents, eq(contents._id, media.contentId))
            .execute();
    } else {
        console.log("Haven't implemented getUserHistory");
        return [];
    }
};

export const getMediaHistory = async (mediaId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(history)
            .where(eq(history.mediaId, mediaId))
            .execute();
    } else {
        console.log("Haven't implemented getMediaHistory");
        return [];
    }
};

export const getAllHistory = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(history)
            .execute();
    } else {
        console.log("Haven't implemented getAllHistory");
        return [];
    }
};

export const updateHistory = async (
    userId: string,
    mediaId: string,
    updateData: Partial<{
        progress: number;
        watchedAt: Date;
    }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.update(history)
            .set(updateData)
            .where(and(
                eq(history.userId, userId),
                eq(history.mediaId, mediaId)
            ))
            .execute();
        return getHistoryEntry(userId, mediaId);
    } else {
        console.log("Haven't implemented updateHistory");
        return null;
    }
};

export const deleteHistory = async (userId: string, mediaId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.delete(history)
            .where(and(
                eq(history.userId, userId),
                eq(history.mediaId, mediaId)
            ))
            .execute();
        return { success: true };
    } else {
        console.log("Haven't implemented deleteHistory");
        return { success: false };
    }
};

export const getMediaContentId = async (mediaId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [result] = await db.client.select({
            contentId: media.contentId
        })
            .from(media)
            .where(eq(media._id, mediaId))
            .execute();

        return result?.contentId;
    } else {
        console.log("Haven't implemented getMediaContentId");
        return null;
    }
};

export const deleteHistoryByContentId = async (userId: string, contentId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const mediaIds = await db.client.select({ id: media._id })
            .from(media)
            .where(eq(media.contentId, contentId))
            .execute();

        const ids = mediaIds.map(item => item.id);

        await db.client.delete(history)
            .where(
                and(
                    eq(history.userId, userId),
                    inArray(history.mediaId, ids)
                )
            )
            .execute();
        return { success: true };
    } else {
        console.log("Haven't implemented deleteHistoryByContentId");
        return { success: false };
    }
};
import { getDB } from "@db/client";
import { directors } from "@schema/sql/directors.schema";
import { eq, and, inArray } from "drizzle-orm";

export const addDirectorsToContent = async (
    contentId: string,
    directorsData: Array<{ personId: string; rank: number }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .insert(directors)
            .values(
                directorsData.map((director) => ({
                    contentId,
                    personId: director.personId,
                    rank: director.rank,
                }))
            )
            .execute();
    }
};

export const getDirectorsForContent = async (contentId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .select()
            .from(directors)
            .where(eq(directors.contentId, contentId))
            .execute();
    }
};

export const removeDirectorsFromContent = async (
    contentId: string,
    personIds: string[]
) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .delete(directors)
            .where(
                and(
                    eq(directors.contentId, contentId),
                    inArray(directors.personId, personIds)
                )
            )
            .execute();
    }
};

export const setDirectorsForContent = async (
    contentId: string,
    directorsData: Array<{ personId: string; rank: number }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.transaction(async (tx) => {
            await tx
                .delete(directors)
                .where(eq(directors.contentId, contentId));

            if (directorsData.length > 0) {
                await tx.insert(directors).values(
                    directorsData.map((director) => ({
                        contentId,
                        personId: director.personId,
                        rank: director.rank,
                    }))
                );
            }
        });
    }
};
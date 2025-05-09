import { getDB } from "@db/client";
import { casts } from "@schema/sql/casts.schema";
import { eq, and, inArray } from "drizzle-orm";

export const addCastsToContent = async (
    contentId: string,
    castsData: Array<{ personId: string; character: string; rank: number }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .insert(casts)
            .values(
                castsData.map((cast) => ({
                    contentId,
                    personId: cast.personId,
                    character: cast.character,
                    rank: cast.rank,
                }))
            )
            .execute();
    }
};

export const getCastsForContent = async (contentId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .select()
            .from(casts)
            .where(eq(casts.contentId, contentId))
            .execute();
    }
};

export const removeCastsFromContent = async (
    contentId: string,
    personIds: string[]
) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .delete(casts)
            .where(
                and(
                    eq(casts.contentId, contentId),
                    inArray(casts.personId, personIds)
                )
            )
            .execute();
    }
};

export const setCastsForContent = async (
    contentId: string,
    castsData: Array<{ personId: string; character: string; rank: number }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.transaction(async (tx) => {
            // Clear existing relationships
            await tx
                .delete(casts)
                .where(eq(casts.contentId, contentId));

            // Insert new relationships
            if (castsData.length > 0) {
                await tx.insert(casts).values(
                    castsData.map((cast) => ({
                        contentId,
                        personId: cast.personId,
                        character: cast.character,
                        rank: cast.rank,
                    }))
                );
            }
        });
    }
};


export const getContentForCast = async (personId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .select()
            .from(casts)
            .where(eq(casts.personId, personId))
            .execute();
    }
};
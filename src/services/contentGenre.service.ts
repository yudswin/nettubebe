import { getDB } from "@db/client";
import { contentGenre } from "@schema/sql/contentGenre.schema";
import { genres } from "@schema/sql/genres.schema";
import { eq, and, inArray } from "drizzle-orm";

export const addGenresToContent = async (
    contentId: string,
    genreIds: string[]
) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .insert(contentGenre)
            .values(genreIds.map(genreId => ({
                contentId,
                genreId
            })))
            .execute();
    }
};

export const getGenresForContent = async (contentId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .select({
                _id: genres._id,
                name: genres.name,
                englishName: genres.englishName,
                slug: genres.slug
            })
            .from(contentGenre)
            .where(eq(contentGenre.contentId, contentId))
            .leftJoin(genres, (eq(genres._id, contentGenre.genreId)))
            .execute();
    }
};

export const removeGenresFromContent = async (
    contentId: string,
    genreIds: string[]
) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .delete(contentGenre)
            .where(
                and(
                    eq(contentGenre.contentId, contentId),
                    inArray(contentGenre.genreId, genreIds)
                )
            )
            .execute();
    }
};

export const setGenresForContent = async (
    contentId: string,
    genreIds: string[]
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.transaction(async (tx) => {
            await tx
                .delete(contentGenre)
                .where(eq(contentGenre.contentId, contentId));

            if (genreIds.length > 0) {
                await tx.insert(contentGenre)
                    .values(genreIds.map(genreId => ({
                        contentId,
                        genreId
                    })));
            }
        });
    }
};
import { genres, Genres, NewGenres } from "@schema/sql/genres.schema";
import { getDB } from '@db/client';
import { eq } from "drizzle-orm";

export const createGenre = async (genreData: NewGenres) => {
    const db = getDB();

    if (db.type === "mysql") {
        await db.client.insert(genres)
            .values(genreData)
            .execute();
        return getGenreById(genreData._id);
    }
};

export const getGenreById = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [genre] = await db.client.select()
            .from(genres)
            .where(eq(genres._id, id))
            .execute();
        return genre;
    } else {
        console.log("Haven't implemented getGenreById")
    }
};

export const getGenreBySlug = async (slug: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [genre] = await db.client.select()
            .from(genres)
            .where(eq(genres.slug, slug))
            .execute();
        return genre;
    } else {
        console.log("Haven't implemented getGenreBySlug")
    }
};

export const getAllGenres = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(genres)
            .execute();
    } else {
        console.log("Haven't implemented getAllGenres")
        return [];
    }
};

export const updateGenre = async (
    id: string,
    updateData: Partial<{
        name: string;
        englishName: string;
        slug: string;
    }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.update(genres)
            .set(updateData)
            .where(eq(genres._id, id))
            .execute();
        return getGenreById(id);
    } else {
        console.log("Haven't implemented updateGenre")
        return null;
    }
};

export const deleteGenre = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.delete(genres)
            .where(eq(genres._id, id))
            .execute();
        return { success: true };
    } else {
        console.log("Haven't implemented deleteGenre")
        return { success: false };
    }
};
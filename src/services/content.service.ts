import { getDB } from "@db/client";
import { contents, NewContent } from "@schema/sql/contents.schema";
import { eq } from "drizzle-orm";

export const createContent = async (contentData: NewContent) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.insert(contents)
            .values(contentData)
            .execute();
        return getContentById(contentData._id);
    } else {
        console.log("Haven't implemented createContent");
    }
};

export const getContentById = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [content] = await db.client.select()
            .from(contents)
            .where(eq(contents._id, id))
            .execute();
        return content;
    } else {
        console.log("Haven't implemented getContentById");
    }
};

export const getContentBySlug = async (slug: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [content] = await db.client.select()
            .from(contents)
            .where(eq(contents.slug, slug))
            .execute();
        return content;
    } else {
        console.log("Haven't implemented getContentBySlug");
    }
};

export const getAllContents = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(contents)
            .execute();
    } else {
        console.log("Haven't implemented getAllContents");
        return [];
    }
};

export const updateContent = async (
    id: string,
    updateData: Partial<{
        title: string;
        originTitle: string | null;
        englishTitle: string | null;
        slug: string;
        overview: string;
        imdbRating: string;
        lastestEpisode: number | null;
        lastestSeason: number | null;
        rating: string;
        runtime: number | null;
        releaseDate: Date;
        year: number;
        publish: boolean;
        thumbnailPath: string | null;
        bannerPath: string | null;
        type: 'movie' | 'tvshow';
        status: 'upcoming' | 'finish' | 'updating';
    }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.update(contents)
            .set(updateData)
            .where(eq(contents._id, id))
            .execute();
        return getContentById(id);
    } else {
        console.log("Haven't implemented updateContent");
        return null;
    }
};

export const deleteContent = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.delete(contents)
            .where(eq(contents._id, id))
            .execute();
        return { success: true };
    } else {
        console.log("Haven't implemented deleteContent");
        return { success: false };
    }
};
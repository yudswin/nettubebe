import { getDB } from "@db/client";
import { contentCountry } from "@schema/sql/contentCountry.schema";
import { contentGenre } from "@schema/sql/contentGenre.schema";
import { contents, NewContent } from "@schema/sql/contents.schema";
import { countries } from "@schema/sql/countries.schema";
import { genres } from "@schema/sql/genres.schema";
import { and, count, countDistinct, eq, exists, inArray, like, or } from "drizzle-orm";

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

export const searchContents = async (query: string, page = 1, limit = 10) => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(contents)
            .where(
                or(
                    like(contents.title, `%${query}%`),
                    like(contents.originTitle, `%${query}%`),
                    like(contents.englishTitle, `%${query}%`),
                    like(contents.overview, `%${query}%`)
                )
            )
            .limit(limit)
            .offset((page - 1) * limit)
            .execute();
    } else {
        console.log("Haven't implemented searchContents");
        return [];
    }
};

export const browseContents = async (filters: {
    years?: number[];
    type?: 'movie' | 'tvshow';
    status?: 'upcoming' | 'finish' | 'updating';
    genreSlugs?: string[];
    countrySlugs?: string[];
    page?: number;
    limit?: number;
}) => {
    const db = getDB();
    const { years, type, status, genreSlugs, countrySlugs, page = 1, limit = 10 } = filters;

    if (db.type === "mysql") {
        const conditions = [];

        if (genreSlugs?.length) {
            conditions.push(
                exists(
                    db.client.select()
                        .from(contentGenre)
                        .innerJoin(genres, eq(contentGenre.genreId, genres._id))
                        .where(and(
                            eq(contentGenre.contentId, contents._id),
                            inArray(genres.slug, genreSlugs)
                        ))
                )
            )
        }
        if (countrySlugs?.length) {
            conditions.push(
                exists(
                    db.client.select()
                        .from(contentCountry)
                        .innerJoin(countries, eq(contentCountry.countryId, countries._id))
                        .where(and(
                            eq(contentCountry.contentId, contents._id),
                            inArray(countries.slug, countrySlugs)
                        ))
                )
            );
        }
        if (type) {
            conditions.push(eq(contents.type, type));
        }

        if (status) {
            conditions.push(eq(contents.status, status));
        }
        if (years?.length) {
            conditions.push(inArray(contents.year, years));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const results = await db.client.select()
            .from(contents)
            .where(whereClause)
            .limit(limit)
            .offset((page - 1) * limit);

        // Get total count for pagination
        const totalResult = await db.client
            .select({ count: count() })
            .from(contents)
            .where(whereClause);

        const totalItems = Number(totalResult[0]?.count || 0);
        const totalPages = Math.ceil(totalItems / limit);

        return {
            results,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages
            }
        };
    }

    // Handle other database types
    return {
        results: [],
        pagination: {
            page,
            limit,
            totalItems: 0,
            totalPages: 0
        }
    };
};
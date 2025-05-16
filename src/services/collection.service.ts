import { getDB } from "@db/client";
import { collections, CollectionType, NewCollection } from "@schema/sql/collections.schema";
import { and, asc, desc, eq, ne, or, sql } from "drizzle-orm";

export const createCollection = async (collectionData: NewCollection) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.insert(collections)
            .values(collectionData)
            .execute()
        return getCollectionById(collectionData._id)
    }
}

export const getCollectionById = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [result] = await db.client.select()
            .from(collections)
            .where(eq(collections._id, id))
            .execute()
        return result
    }
}

export const getCollectionBySlug = async (slug: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [result] = await db.client.select()
            .from(collections)
            .where(eq(collections.slug, slug))
            .execute()
        return result
    }
}

export const getAllCollections = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
                .from(collections)
                .orderBy(desc(collections.createdAt))
                .execute()
    }
}

export const getAllCollectionsWithOutFeatures = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
                .from(collections)
                .where(ne(collections.type, 'features'))
                .execute()
    }
}

export const getTopicCollections = async (limit?: number) => {
    const db = getDB();
    if (db.type === "mysql") {
        if (limit)
            return await db.client.select()
                .from(collections)
                .limit(limit)
                .execute()
        else
            return await db.client.select()
                .from(collections)
                .execute()
    }
}

export const updateCollection = async (
    id: string,
    updateData: Partial<{
        name: string,
        slug: string,
        description: string,
        type: 'topic' | 'hot' | 'features',
        publish: boolean,
    }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.update(collections)
            .set(updateData)
            .where(eq(collections._id, id))
            .execute()
        return { success: true };
    } else {
        return { success: false };
    }
}

export const deleteCollection = async (id: string) => {
    const db = getDB()
    if (db.type === "mysql") {
        await db.client.delete(collections)
            .where(eq(collections._id, id))
            .execute()
        return { success: true };
    } else {
        return { success: false };
    }
}

export const countCollections = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        const [result] = await db.client.select({ count: sql`count(*)` })
            .from(collections)
            .where(
                and(
                    or(
                        // eq(collections.type, 'hot'),
                        // eq(collections.type, 'topic'),
                        ne(collections.type, 'features')
                    ),
                    // eq(collections.publish, true)
                )
            )
            .execute();
        return result.count as number;
    }
    return 0;
}

export const getHeadlineCollection = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        const [result] = await db.client.select()
            .from(collections)
            .where(
                and(
                    eq(collections.type, 'features'),
                    eq(collections.publish, true)
                )
            )
            .orderBy(asc(collections.createdAt))
            .limit(1)
        return result
    }
    return 0;
}


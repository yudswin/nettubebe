import { getDB } from "@db/client";
import { collections, CollectionType, NewCollection } from "@schema/sql/collections.schema";
import { eq, sql } from "drizzle-orm";

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

export const getAllCollections = async (limit?: number) => {
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
            .execute();
        return result.count as number;
    }
    return 0;
}
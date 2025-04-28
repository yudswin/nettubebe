import { getDB } from "@db/client";
import { favorites, NewFavorite } from "@schema/sql/favorites.schema";
import { and, eq } from "drizzle-orm";

export const createFavorite = async (favoriteData: NewFavorite) => {
    const db = getDB();
    if (db.type === "mysql") {
        const existingFavorite = await getFavorite(favoriteData.userId, favoriteData.contentId);
        if (existingFavorite) {
            await db.client.update(favorites)
                .set({ favoritedAt: new Date() })
                .where(and(
                    eq(favorites.userId, favoriteData.userId),
                    eq(favorites.contentId, favoriteData.contentId)
                ))
                .execute();
        } else {
            await db.client.insert(favorites)
                .values(favoriteData)
                .execute();
        }
        return getFavorite(favoriteData.userId, favoriteData.contentId);
    } else {
        console.log("Haven't implemented createFavorite");
    }
};

export const getFavorite = async (userId: string, contentId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [favorite] = await db.client.select()
            .from(favorites)
            .where(and(
                eq(favorites.userId, userId),
                eq(favorites.contentId, contentId)
            ))
            .execute();
        return favorite;
    } else {
        console.log("Haven't implemented getFavorite");
    }
};

export const getUserFavorites = async (userId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(favorites)
            .where(eq(favorites.userId, userId))
            .execute();
    } else {
        console.log("Haven't implemented getUserFavorites");
        return [];
    }
};

export const getContentFavorites = async (contentId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(favorites)
            .where(eq(favorites.contentId, contentId))
            .execute();
    } else {
        console.log("Haven't implemented getContentFavorites");
        return [];
    }
};

export const getAllFavorites = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(favorites)
            .execute();
    } else {
        console.log("Haven't implemented getAllFavorites");
        return [];
    }
};

export const deleteFavorite = async (userId: string, contentId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.delete(favorites)
            .where(and(
                eq(favorites.userId, userId),
                eq(favorites.contentId, contentId)
            ))
            .execute();
        return { success: true };
    } else {
        console.log("Haven't implemented deleteFavorite");
        return { success: false };
    }
};
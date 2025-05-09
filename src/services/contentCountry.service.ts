import { getDB } from "@db/client";
import { contentCountry } from "@schema/sql/contentCountry.schema";
import { countries } from "@schema/sql/countries.schema";
import { eq, and, inArray } from "drizzle-orm";

export const addCountriesToContent = async (
    contentId: string,
    countryIds: string[]
) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .insert(contentCountry)
            .values(countryIds.map(countryId => ({
                contentId,
                countryId
            })))
            .execute();
    }
};

export const getCountriesForContent = async (contentId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .select({
                _id: countries._id,
                name: countries.name,
                slug: countries.slug,
                code: countries.code
            })
            .from(contentCountry)
            .where(eq(contentCountry.contentId, contentId))
            .leftJoin(countries, (eq(countries._id, contentCountry.countryId)))
            .execute();
    }
};

export const removeCountriesFromContent = async (
    contentId: string,
    countryIds: string[]
) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client
            .delete(contentCountry)
            .where(
                and(
                    eq(contentCountry.contentId, contentId),
                    inArray(contentCountry.countryId, countryIds)
                )
            )
            .execute();
    }
};

export const setCountriesForContent = async (
    contentId: string,
    countryIds: string[]
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.transaction(async (tx) => {
            await tx
                .delete(contentCountry)
                .where(eq(contentCountry.contentId, contentId));

            if (countryIds.length > 0) {
                await tx.insert(contentCountry)
                    .values(countryIds.map(countryId => ({
                        contentId,
                        countryId
                    })));
            }
        });
    }
};
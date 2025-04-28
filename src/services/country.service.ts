import { countries, NewCountry } from "@schema/sql/countries.schema";
import { getDB } from '@db/client';
import { eq } from "drizzle-orm";

export const createCountry = async (countryData: NewCountry) => {
    const db = getDB();

    if (db.type === "mysql") {
        await db.client.insert(countries)
            .values(countryData)
            .execute();
        return getCountryById(countryData._id);
    }
};

export const getCountryById = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [country] = await db.client.select()
            .from(countries)
            .where(eq(countries._id, id))
            .execute();
        return country;
    } else {
        console.log("Haven't implemented getCountryById")
    }
};

export const getCountryBySlug = async (slug: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [country] = await db.client.select()
            .from(countries)
            .where(eq(countries.slug, slug))
            .execute();
        return country;
    } else {
        console.log("Haven't implemented getCountryBySlug")
    }
};

export const getCountryByCode = async (code: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [country] = await db.client.select()
            .from(countries)
            .where(eq(countries.code, code))
            .execute();
        return country;
    } else {
        console.log("Haven't implemented getCountryByCode")
    }
};

export const getAllCountries = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(countries)
            .execute();
    } else {
        console.log("Haven't implemented getAllCountries")
        return [];
    }
};

export const updateCountry = async (
    id: string,
    updateData: Partial<{
        name: string;
        slug: string;
        code: string;
    }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.update(countries)
            .set(updateData)
            .where(eq(countries._id, id))
            .execute();
        return getCountryById(id);
    } else {
        console.log("Haven't implemented updateCountry")
        return null;
    }
};

export const deleteCountry = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.delete(countries)
            .where(eq(countries._id, id))
            .execute();
        return { success: true };
    } else {
        console.log("Haven't implemented deleteCountry")
        return { success: false };
    }
};
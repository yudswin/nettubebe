import { getDB } from "@db/client";
import { person, NewPerson } from "@schema/sql/person.schema";
import { eq } from "drizzle-orm";

export const createPerson = async (personData: NewPerson) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.insert(person)
            .values(personData)
            .execute();
        return getPersonById(personData._id);
    } else {
        console.log("Haven't implemented createPerson");
    }
};

export const getPersonById = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [newPerson] = await db.client.select()
            .from(person)
            .where(eq(person._id, id))
            .execute();
        return newPerson;
    } else {
        console.log("Haven't implemented getPersonById");
    }
};

export const getPersonBySlug = async (slug: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [newPerson] = await db.client.select()
            .from(person)
            .where(eq(person.slug, slug))
            .execute();
        return newPerson;
    } else {
        console.log("Haven't implemented getPersonBySlug");
    }
};

export const getAllPersons = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(person)
            .execute();
    } else {
        console.log("Haven't implemented getAllPersons");
        return [];
    }
};

export const updatePerson = async (
    id: string,
    updateData: Partial<{
        name: string;
        slug: string;
        profilePath: string | null;
    }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.update(person)
            .set(updateData)
            .where(eq(person._id, id))
            .execute();
        return getPersonById(id);
    } else {
        console.log("Haven't implemented updatePerson");
        return null;
    }
};

export const deletePerson = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.delete(person)
            .where(eq(person._id, id))
            .execute();
        return { success: true };
    } else {
        console.log("Haven't implemented deletePerson");
        return { success: false };
    }
};
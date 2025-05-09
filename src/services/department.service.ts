import { getDB } from "@db/client";
import { departments, NewDepartment } from "@schema/sql/departments.schema";
import { eq, like } from "drizzle-orm";

export const createDepartment = async (deptData: NewDepartment) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [NewDepartment] = await db.client.insert(departments)
            .values(deptData)
            .execute();
        return getById(deptData._id)
    } else {
        console.log("Haven't implemented createDepartment")
    }
}

export const getById = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [department] = await db.client.select()
            .from(departments)
            .where(eq(departments._id, id))
            .execute();
        return department;
    } else {
        console.log("Haven't implemented getById")
    }
}

export const getBySlug = async (slug: string) => {
    const db = getDB()
    if (db.type === "mysql") {
        const [department] = await db.client.select()
            .from(departments)
            .where(eq(departments.slug, slug))
            .execute()
        return department
    } else console.log("Haven't implemented getBySlug")
}

export const getAllDepartment = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select()
            .from(departments)
            .execute();
    } else {
        console.log("Haven't implemented getAllDepartment")
        return [];
    }
}

export const updateDepartment = async (
    id: string,
    updateData: Partial<{
        name: string;
        slug: string;
    }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.update(departments)
            .set(updateData)
            .where(eq(departments._id, id))
            .execute();
        return getById(id);
    } else {
        console.log("Haven't implemented updateDepartment")
        return null;
    }
};

export const deleteDepartment = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.delete(departments)
            .where(eq(departments._id, id))
            .execute();
        return { success: true };
    } else {
        console.log("Haven't implemented deleteDepartment")
        return { success: false };
    }
};

export const searchDepartment = async (query: string, page = 1, limit = 5) => {
    const db = getDB()
    if (db.type === "mysql") {
        return await db.client.select()
            .from(departments)
            .where(
                like(departments.name, `%${query}%`)
            )
            .limit(limit)
            .offset((page - 1) * limit)
            .execute();
    } else {
        console.log("Haven't implemented searchPerson");
        return [];
    }
}
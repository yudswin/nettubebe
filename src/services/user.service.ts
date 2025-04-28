import { NewUser, users as sqlUsers, UserRole } from "@schema/sql/users.schema";
import { getDB } from '@db/client';
import { eq } from "drizzle-orm";
import { imgs } from "@schema/sql/imgs.schema";

export const createUser = async (userData: NewUser) => {
    const db = getDB();

    if (db.type === "mysql") {
        const [newUser] = await db.client.insert(sqlUsers)
            .values(userData)
            .execute();
        return getById(userData._id)
    }
};

export const getById = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [user] = await db.client.select()
            .from(sqlUsers)
            .where(eq(sqlUsers._id, id))
            .execute();
        return user;
    } else {
        console.log("Haven't implemented getById")
    }
};

export const getByEmail = async (email: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [user] = await db.client
            .select()
            .from(sqlUsers)
            .where(eq(sqlUsers.email, email))
            .execute();
        return user;
    } else {
        console.log("Haven't implemented getByEmail")
    }
};

export const getByEmailWithoutPass = async (email: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [user] = await db.client
            .select({
                name: sqlUsers.name,
                email: sqlUsers.email,
                avatarId: sqlUsers.avatarId,
                token: sqlUsers.token,
                roles: sqlUsers.roles,
                gender: sqlUsers.gender,
                isVerified: sqlUsers.isVerified,
                isActive: sqlUsers.isActive,
                imgs
            })
            .from(sqlUsers)
            .where(eq(sqlUsers.email, email)).leftJoin(imgs, (eq(sqlUsers.avatarId, imgs._id)))
            .execute();
        return user;
    } else {
        console.log("Haven't implemented getByEmail")
    }
};

export const getUsers = async () => {
    const db = getDB();
    if (db.type === "mysql") {
        return await db.client.select().from(sqlUsers).leftJoin(imgs, (eq(sqlUsers.avatarId, imgs._id)))
            .execute();
    } else return console.error('Error fetching users');
};

export const updateUser = async (
    id: string,
    updateData: Partial<{
        name: string;
        email: string;
        password: string;
        avatarId: string | null;
        token: string | null;
        gender: 'male' | 'female' | 'none';
    }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client
            .update(sqlUsers)
            .set(updateData)
            .where(eq(sqlUsers._id, id))
            .execute();
        return { success: true };
    } else return console.error('Error updating user');
};

export const deleteUser = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client
            .delete(sqlUsers)
            .where(eq(sqlUsers._id, id))
            .execute();
        return { success: true };
    } else return console.error('Error deleting user');
};
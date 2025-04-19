import { users as pgUsers } from "@schema/pg/user.schema";
import { NewUser, users as sqlUsers, UserRole } from "@schema/sql/user.schema";
import { getDB } from '@db/client';
import { eq } from "drizzle-orm";

export const createUser = async (
    // name: string, 
    // age: number = 0, 
    // email: string, 
    userData: NewUser
) => {
    const db = getDB();

    // MySQL specific insert
    if (db.type === "mysql") {
        const [newUser] = await db.client.insert(sqlUsers)
            .values(userData)
            .execute()

        return getById(newUser.insertId)
    }

    // PostgreSQL specific insert
    else if (db.type === "postgres") {
        // const user: typeof pgUsers.$inferInsert = {
        //     name: name,
        //     email: email,
        //     age: age,
        // };
        // const result = await db.client.insert(pgUsers)
        //     .values(user)
        //     .returning({ id: pgUsers.id });
        // return result[0];
        return
    }
};

export const getById = async (id: number) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [user] = await db.client.select()
            .from(sqlUsers)
            .where(eq(sqlUsers.id, id)
            ).execute()
        return user
    } else {
        console.log("Haven't implemented getById")
    }
}

export const getByEmail = async (email: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [user] = await db.client
            .select()
            .from(sqlUsers)
            .where(eq(sqlUsers.email, email)
            ).execute()
        return user
    } else {
        console.log("Haven't implemented getByEmail")
    }
}

export const getByEmailWithoutPass = async (email: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [user] = await db.client
            .select({
                id: sqlUsers.id,
                username: sqlUsers.username,
                email: sqlUsers.email,
                joinDate: sqlUsers.joinDate,
                avatarId: sqlUsers.avatarId,
                refreshToken: sqlUsers.refreshToken,
                role: sqlUsers.role
            })
            .from(sqlUsers)
            .where(eq(sqlUsers.email, email)
            ).execute()
        return user
    } else {
        console.log("Haven't implemented getByEmail")
    }
}

export const getUsers = async () => {
    const db = getDB();
    try {
        if (db.type === "mysql") {
            return await db.client.select().from(sqlUsers);
        } else {
            return await db.client.select().from(pgUsers);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const updateUser = async (
    id: number,
    updateData: Partial<{
        username: string;
        email: string;
        password: string;
        avatarId: number | null;
        accessToken: string | null;
        refreshToken: string | null;
        role: UserRole;
    }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        // MySQL update
        await db.client
            .update(sqlUsers)
            .set(updateData)
            .where(eq(sqlUsers.id, id));

        return { success: true };
    } else {
        // PostgreSQL update 
        const result = await db.client
            .update(pgUsers)
            .set(updateData)
            .where(eq(pgUsers.id, id))
            .returning({ id: pgUsers.id });

        return result[0];
    }
};

export const deleteUser = async (id: number) => {
    const db = getDB();

    try {
        if (db.type === "mysql") {
            // MySQL delete
            await db.client
                .delete(sqlUsers)
                .where(eq(sqlUsers.id, id));

            return { success: true };
        } else {
            // PostgreSQL delete
            const result = await db.client
                .delete(pgUsers)
                .where(eq(pgUsers.id, id))
                .returning({ id: pgUsers.id });

            return result[0];
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }
};
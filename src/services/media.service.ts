import { getDB } from "@db/client";
import { avatars, NewAvatar } from "@schema/sql/avatar.schema";
import { eq } from "drizzle-orm";

export const createAvatarRecord = async (
    newAvatar: NewAvatar
) => {
    const db = getDB();
    if (db.type === "mysql") {
        // MySQL update
        const [avatar] = await db.client.insert(avatars)
            .values(newAvatar)
            .execute()

        return getAvatarRecord(avatar.insertId)
    } else {
        return console.log("Haven't implemented getById")
    }
}

export const getAvatarRecord = async (id: number) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [avatar] = await db.client.select()
            .from(avatars)
            .where(eq(avatars.id, id)
            ).execute()
        return avatar
    } else {
        console.log("Haven't implemented getById")
    }
}
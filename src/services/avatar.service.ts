import { getDB } from "@db/client";
import { imgs, NewImage } from "@schema/sql/imgs.schema";
import { eq } from "drizzle-orm";

export const createAvatarRecord = async (
    newAvatar: NewImage
) => {
    const db = getDB();
    if (db.type === "mysql") {
        // MySQL update
        const [avatar] = await db.client.insert(imgs)
            .values(newAvatar)
            .execute()
        return getAvatarRecord(newAvatar._id)
    } else {
        return console.log("Haven't implemented createAvatarRecord")
    }
}

export const getAvatarRecord = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [avatar] = await db.client.select()
            .from(imgs)
            .where(eq(imgs._id, id)
            ).execute()
        return avatar
    } else {
        return console.log("Haven't implemented getAvatarRecord")
    }
}

export const deleteAvatar = async (id: string): Promise<any> => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client
            .delete(imgs)
            .where(eq(imgs._id, id))
            .execute();
        return { success: true };
    } else return console.error('Error deleting image.')
};




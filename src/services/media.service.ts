import { getDB } from "@db/client"
import { AudioType, NewMedia, media } from "@schema/sql/media.schema"
import { eq } from "drizzle-orm";

export const createMediaRecord = async (
    newRecord: NewMedia
) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [record] = await db.client.insert(media)
            .values(newRecord)
            .execute()
        return getMediaRecord(newRecord._id)
    } else {
        return console.log("Haven't implemented")
    }
}

export const getMediaRecord = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [record] = await db.client.select()
            .from(media)
            .where(eq(media._id, id))
            .execute()
        return record
    } else {
        console.log("Haven't implemented getById")
    }
}


export const updataRecord = async (
    id: string,
    updateData: Partial<{
        episode: number;
        season: number;
        audioType: AudioType;
        title: string;
    }>
) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client
            .update(media)
            .set(updateData)
            .where(eq(media._id, id))
            .execute();
        return { success: true };
    } else return console.error('Error updating record.');
}


export const deleteRecord = async (id: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client
            .delete(media)
            .where(eq(media._id, id))
            .execute();
        return { success: true };
    } else return console.error('Error deleting media.');
};
import { getDB } from "@db/client"
import { NewMedia, media } from "@schema/sql/media.schema"
import { eq } from "drizzle-orm";

export const createMediaRecord = async (
    newRecord: NewMedia
) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [record] = await db.client.insert(media)
            .values(newRecord)
            .execute()
        return getMediaRecord(record.insertId)

    } else {
        return console.log("Haven't implemented")
    }
}

export const getMediaRecord = async (id: number) => {
    const db = getDB();
    if (db.type === "mysql") {
        const [record] = await db.client.select()
            .from(media)
            .where(eq(media.id, id)
            ).execute()
        return record
    } else {
        console.log("Haven't implemented getById")
    }
}
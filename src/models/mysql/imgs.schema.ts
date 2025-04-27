import { mysqlTable, varchar, mysqlEnum, json } from "drizzle-orm/mysql-core";
const imgType = ['avatar', 'person', 'thumbnail', 'banner']

export const imgs = mysqlTable('imgs', {
    _id: varchar('_id', { length: 12 }).primaryKey(),
    imgurId: varchar('imgur_id', { length: 255 }).unique().notNull(),
    deleteHash: varchar('delete_hash', { length: 255 }).notNull(),
    path: varchar('path', { length: 255 }).notNull(),
    type: mysqlEnum('type', ['avatar', 'person', 'thumbnail', 'banner']).notNull(),
    metadata: json('metadata').notNull(),
});

export type Image = typeof imgs.$inferSelect;
export type NewImage = typeof imgs.$inferInsert;
export type ImageType = typeof imgType[number];
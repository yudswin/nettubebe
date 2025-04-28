import { mysqlTable, varchar, int, mysqlEnum } from "drizzle-orm/mysql-core";
import { contents } from "./contents.schema";

export const audioType = ['subtitle', 'original', 'voiceover'] as const

export const media = mysqlTable('media', {
    _id: varchar('_id', { length: 12 }).primaryKey(),
    episode: int('episode').notNull().default(1),
    season: int('season').notNull().default(1),
    publicId: varchar('public_id', { length: 255 }).unique().notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    audioType: mysqlEnum('audio_type', ['subtitle', 'original', 'voiceover']).notNull(),
    contentId: varchar('content_id', { length: 12 })
    .notNull()
    .references(() => contents._id, {
        onDelete: 'cascade'
    }),
});

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type AudioType = typeof audioType[number]
import { mysqlTable, varchar, timestamp, int } from 'drizzle-orm/mysql-core';

export const media = mysqlTable(
    'media',
    {
        id: int('id').primaryKey().autoincrement(),
        mediaId: varchar('mediaId', { length: 255 }).primaryKey(),
        title: varchar('title', { length: 255 }).notNull(),
        createdDate: timestamp('createdDate').default(new Date()).notNull(),
    }
)

export type NewMedia = typeof media.$inferInsert;
export type Media = typeof media.$inferSelect;
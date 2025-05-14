import { mysqlTable, primaryKey, varchar, timestamp, int } from "drizzle-orm/mysql-core";
import { collections } from "./collections.schema";
import { contents } from "./contents.schema";

export const collectionContent = mysqlTable('collection_content', {
    collectionId: varchar('collection_id', { length: 12 })
        .notNull()
        .references(() => collections._id, {
            onDelete: 'cascade'
        }),
    contentId: varchar('content_id', { length: 12 })
        .notNull()
        .references(() => contents._id, {
            onDelete: 'cascade'
        }),
    rank: int('rank').notNull().default(1),
    addedAt: timestamp('added_at').notNull().defaultNow(),
}, (t) => [
    primaryKey({ columns: [t.collectionId, t.contentId] })
])

export type NewCollectionContent = typeof collectionContent.$inferInsert;

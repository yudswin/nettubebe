import { mysqlTable, varchar, timestamp, int, primaryKey } from "drizzle-orm/mysql-core";
import { users } from "./users.schema";
import { media } from "./media.schema";

export const history = mysqlTable('history', {
    userId: varchar('user_id', { length: 12 })
        .notNull()
        .references(() => users._id, {
            onDelete: 'cascade'
        }),
    mediaId: varchar('media_id', { length: 12 })
        .notNull()
        .references(() => media._id, {
            onDelete: 'cascade'
        }),
    watchedAt: timestamp('watched_at').notNull().defaultNow(),
    progress: int('progress'),
},
    (t) => [
        primaryKey({ columns: [t.userId, t.mediaId] })
    ]
);

export type History = typeof history.$inferSelect;
export type NewHistory = typeof history.$inferInsert;
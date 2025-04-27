import { varchar, mysqlTable, timestamp, primaryKey } from "drizzle-orm/mysql-core";
import { users } from "./users.schema";
import { contents } from "./contents.schema";

export const favorites = mysqlTable('favorites', {
    userId: varchar('user_id', { length: 12 })
        .notNull()
        .references(() => users._id),
    contentId: varchar('content_id', { length: 12 })
        .notNull()
        .references(() => contents._id),
    favoritedAt: timestamp('favorited_at').notNull().defaultNow(),
},
    (t) => [
        primaryKey({ columns: [t.userId, t.contentId] })
    ],
);

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;

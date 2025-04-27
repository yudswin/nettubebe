import { varchar, primaryKey } from "drizzle-orm/mysql-core";
import { mysqlTable } from "drizzle-orm/mysql-core";
import { contents } from "./contents.schema";
import { genres } from "./genres.schema";

export const contentGenre = mysqlTable('content_genre', {
    contentId: varchar('content_id', { length: 12 })
        .notNull()
        .references(() => contents._id, {
            onDelete: 'cascade'
        }),
    genreId: varchar('genre_id', { length: 12 })
        .notNull()
        .references(() => genres._id, {
            onDelete: 'cascade'
        }),
}, (t) => [
    primaryKey({ columns: [t.contentId, t.genreId] })
])
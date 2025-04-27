import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const genres = mysqlTable('genres', {
    _id: varchar('_id', { length: 12 }).primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    englishName: varchar('english_name', { length: 100 }).unique().notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
});

export type Genres = typeof genres.$inferSelect;
export type NewGenres = typeof genres.$inferInsert;
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const person = mysqlTable('person', {
    _id: varchar('_id', { length: 12 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    profilePath: varchar('profile_path', { length: 255 })
});

export type Person = typeof person.$inferSelect;
export type NewPerson = typeof person.$inferInsert;


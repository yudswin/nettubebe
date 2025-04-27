import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const countries = mysqlTable('countries', {
    _id: varchar('_id', { length: 12 }).primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
    code: varchar('code', { length: 2 }).unique().notNull(),
});

export type Country = typeof countries.$inferSelect;
export type NewCountry = typeof countries.$inferInsert;

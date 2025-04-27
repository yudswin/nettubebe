import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const departments = mysqlTable('departments', {
    _id: varchar('_id', { length: 12 }).primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
});

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;


import { mysqlTable, varchar, mysqlEnum, boolean, timestamp } from "drizzle-orm/mysql-core";

const collectionType = ['topic', 'hot', 'features'];

export const collections = mysqlTable('collections', {
    _id: varchar('_id', { length: 12 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    description: varchar('description', { length: 255 }).notNull(),
    type: mysqlEnum('type', ['topic', 'hot', 'features']).notNull(),
    publish: boolean('publish').notNull().default(false),
    createdAt: timestamp('create_at').notNull().defaultNow()
});

export type CollectionType = typeof collectionType[number]
export type Collection = typeof collections.$inferSelect
export type NewCollection = typeof collections.$inferInsert

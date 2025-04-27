import { varchar, int, primaryKey } from "drizzle-orm/mysql-core";
import { mysqlTable } from "drizzle-orm/mysql-core";
import { person } from "./person.schema";
import { contents } from "./contents.schema";

export const casts = mysqlTable('casts', {
    personId: varchar('person_id', { length: 12 })
        .notNull()
        .references(() => person._id, {
            onDelete: 'cascade'
        }),
    contentId: varchar('content_id', { length: 12 })
        .notNull()
        .references(() => contents._id, {
            onDelete: 'cascade'
        }),
    character: varchar('character', { length: 255 }).notNull(),
    rank: int('rank').notNull().default(1),
}, (t) => [
    primaryKey({ columns: [t.personId, t.contentId] })
])
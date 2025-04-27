import { varchar, primaryKey } from "drizzle-orm/mysql-core";
import { mysqlTable } from "drizzle-orm/mysql-core";
import { contents } from "./contents.schema";
import { countries } from "./countries.schema";

export const contentCountry = mysqlTable('content_country', {
    contentId: varchar('content_id', { length: 12 })
        .notNull()
        .references(() => contents._id, {
            onDelete: 'cascade'
        }),
    countryId: varchar('country_id', { length: 12 })
        .notNull()
        .references(() => countries._id, {
            onDelete: 'cascade'
        }),
}, (t) => [
    primaryKey({ columns: [t.contentId, t.countryId] })
])
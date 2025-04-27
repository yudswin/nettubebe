import { mysqlTable, varchar, decimal, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./users.schema";
import { contents } from "./contents.schema";

export const reviews = mysqlTable('reviews', {
    _id: varchar('_id', { length: 12 }).primaryKey(),
    userId: varchar('user_id', { length: 12 })
        .notNull()
        .references(() => users._id),
    contentId: varchar('content_id', { length: 12 })
        .notNull()
        .references(() => contents._id),
    comment: varchar('comment', { length: 255 }).notNull(),
    rating: decimal('rating', { precision: 2, scale: 1 }),
    reviewAt: timestamp('review_at').notNull().defaultNow(),
});

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
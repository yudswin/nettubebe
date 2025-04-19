import { mysqlTable, int, varchar, timestamp, json } from 'drizzle-orm/mysql-core';
import { users } from './user.schema';

export const avatars = mysqlTable(
    'avatars',
    {
        id: int('id').primaryKey().autoincrement(),
        userId: int('userId')
            .notNull()
            .unique()
            .references(() => users.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),
        imgurId: varchar('imgurId', { length: 255 }).notNull(),
        deletehash: varchar('deleteHash', { length: 255 }).notNull(),
        url: varchar('url', { length: 512 }).notNull(),
        metadata: json('metadata').notNull(),
        createdAt: timestamp('createdAt').defaultNow(),
    }
);

export type Avatar = typeof avatars.$inferSelect;
export type NewAvatar = typeof avatars.$inferInsert;

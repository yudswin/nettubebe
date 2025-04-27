import {
    mysqlTable,
    varchar,
    mysqlEnum,
    boolean,
    date,
    int,
    decimal,
    json,
    primaryKey,
    timestamp
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
export const userRoles = ['user', 'admin', 'dev'] as const;

export const users = mysqlTable(
    'users',
    {
        id: int('id').primaryKey().autoincrement(),
        username: varchar('userName', { length: 50 }).notNull(),
        email: varchar('email', { length: 100 }).notNull().unique(),
        password: varchar('password', { length: 255 }).notNull(),
        joinDate: timestamp('joinDate').default(new Date()).notNull(),
        avatarId: int('avatarId').unique(),
        refreshToken: varchar('refreshToken', { length: 255 }),
        role: mysqlEnum('role', ['user', 'admin', 'dev']).notNull().default('user'),
    },
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = typeof userRoles[number];

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

export const media = mysqlTable(
    'media',
    {
        id: int('id').primaryKey().autoincrement(),
        mediaId: varchar('mediaId', { length: 255 }).primaryKey(),
        title: varchar('title', { length: 255 }).notNull(),
        createdDate: timestamp('createdDate').default(new Date()).notNull(),
    }
)

export type NewMedia = typeof media.$inferInsert;
export type Media = typeof media.$inferSelect;

export const usersRelations = relations(users, ({ one }) => ({
    avatar: one(avatars, {
        fields: [users.id],
        references: [avatars.userId],
    }),
}));

export const avatarsRelations = relations(avatars, ({ one }) => ({
    user: one(users, {
        fields: [avatars.userId],
        references: [users.id],
    }),
}));
import { mysqlTable, int, varchar, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';

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

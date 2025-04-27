import { mysqlTable, varchar, mysqlEnum, boolean } from 'drizzle-orm/mysql-core';
import { imgs } from './imgs.schema';

const userRoles = ['user', 'admin', 'moderator'] as const;
const gender = ['male', 'female', 'none'] as const;

export const users = mysqlTable('users', {
    _id: varchar('_id', { length: 12 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: varchar('password', { length: 60 }).notNull(),
    avatarId: varchar('avatar_id', { length: 12 }).references(() => imgs._id, {
        onDelete: 'set null',
    }),
    token: varchar('token', { length: 255 }),
    roles: mysqlEnum('roles', ['user', 'admin', 'moderator']).notNull().default('user'),
    gender: mysqlEnum('gender', ['male', 'female', 'none']).notNull().default('none'),
    isVerified: boolean('is_verified').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = typeof userRoles[number];
export type UserGender = typeof gender[number];



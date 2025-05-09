import { relations } from 'drizzle-orm';
import { mysqlTable, int, varchar, text, timestamp, index, foreignKey, primaryKey } from 'drizzle-orm/mysql-core';

// Users table
export const users = mysqlTable('users', {
    id: int('id').autoincrement().primaryKey(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
},
    (table) => ({
        usernameIndex: index('username_idx').on(table.username),
        emailIndex: index('email_idx').on(table.email),
    }));

// Posts table with foreign key to users
export const posts = mysqlTable('posts', {
    id: int('id').autoincrement().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    authorId: int('author_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
},
    (table) => ({
        authorIdx: index('author_idx').on(table.authorId),
        titleIndex: index('title_idx').on(table.title),
    }));

// Many-to-many example: UserFollowers
export const userFollowers = mysqlTable('user_followers', {
    userId: int('user_id').notNull().references(() => users.id),
    followerId: int('follower_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
},
    (table) => ({
        pk: primaryKey(table.userId, table.followerId),
        userIdx: index('user_idx').on(table.userId),
        followerIdx: index('follower_idx').on(table.followerId),
    }));

// Export the complete schema
export const mysqlSchema = {
    users,
    posts,
    userFollowers,
    relations,
};
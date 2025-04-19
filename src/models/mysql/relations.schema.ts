import { relations } from 'drizzle-orm';
import { avatars } from './avatar.schema';
import { users } from './user.schema';

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
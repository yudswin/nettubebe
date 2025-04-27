import { contentCountry } from './contentCountry.schema';
import { collectionContent } from './collectionContent.schema';
import { collections } from './collections.schema';
import { contents } from './contents.schema';
import { countries } from './countries.schema';
import { favorites } from './favorites.schema';
import { genres } from './genres.schema';
import { history } from './history.schema';
import { imgs } from './imgs.schema';
import { media } from './media.schema';
import { person } from './person.schema';
import { reviews } from './reviews.schema';
import { users } from './users.schema';
import { relations } from "drizzle-orm";
import { contentGenre } from './contentGenre.schema';
import { personDepartment } from './personDepartment.schema';
import { departments } from './departments.schema';
import { casts } from './casts.schema';
import { directors } from './directors.schema';

export const usersRelations = relations(users, ({ one, many }) => ({
    avatar: one(imgs, {
        fields: [users.avatarId],
        references: [imgs._id],
    }),
    history: many(history),
    favorites: many(favorites),
    reviews: many(reviews)
}));

export const imgsRelations = relations(imgs, ({ one }) => ({
    user: one(users, {
        fields: [imgs._id],
        references: [users.avatarId]
    })
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
    user: one(users, {
        fields: [favorites.userId],
        references: [users._id],
    }),
    content: one(contents, {
        fields: [favorites.contentId],
        references: [contents._id],
    }),
}));

export const historyRelations = relations(history, ({ one }) => ({
    user: one(users, {
        fields: [history.userId],
        references: [users._id],
    }),
    media: one(media, {
        fields: [history.mediaId],
        references: [media._id],
    }),
}));

export const mediaRelations = relations(media, ({ one, many }) => ({
    content: one(contents, {
        fields: [media.contentId],
        references: [contents._id],
    }),
    history: many(history)
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
    user: one(users, {
        fields: [reviews.userId],
        references: [users._id],
    }),
    content: one(contents, {
        fields: [reviews.contentId],
        references: [contents._id],
    }),
}));

export const contentsRelations = relations(contents, ({ many }) => ({
    casts: many(casts),
    directors: many(directors),
    genres: many(contentGenre),
    countries: many(contentCountry),
    favorites: many(favorites),
    reviews: many(reviews),
    media: many(media),
    collections: many(collectionContent),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
    collectionContent: many(collectionContent),
}));

export const collectionContentRelations = relations(collectionContent, ({ one }) => ({
    collection: one(collections, {
        fields: [collectionContent.collectionId],
        references: [collections._id]
    }),
    content: one(contents, {
        fields: [collectionContent.contentId],
        references: [contents._id]
    })
}));

export const contentCountryRelations = relations(contentCountry, ({ one }) => ({
    content: one(contents, {
        fields: [contentCountry.contentId],
        references: [contents._id]
    }),
    country: one(countries, {
        fields: [contentCountry.countryId],
        references: [countries._id]
    })
}));

export const contentGenreRelations = relations(contentGenre, ({ one }) => ({
    content: one(contents, {
        fields: [contentGenre.contentId],
        references: [contents._id]
    }),
    genre: one(genres, {
        fields: [contentGenre.genreId],
        references: [genres._id]
    })
}))

export const countriesRelations = relations(countries, ({ many }) => ({
    contentCountry: many(contentCountry)
}));

export const genresRelations = relations(genres, ({ many }) => ({
    contentGenre: many(contentGenre)
}));

export const personRelations = relations(person, ({ many }) => ({
    departments: many(personDepartment),
    castings: many(casts),
    directs: many(directors)
}))

export const departmentsRelation = relations(departments, ({ many }) => ({
    person: many(personDepartment)
}))

export const personDepartmentRelations = relations(personDepartment, ({ one }) => ({
    person: one(person, {
        fields: [personDepartment.personId],
        references: [person._id]
    }),
    department: one(departments, {
        fields: [personDepartment.departmentId],
        references: [departments._id]
    })
}));

export const directorsRelations = relations(directors, ({ one }) => ({
    content: one(contents, {
        fields: [directors.contentId],
        references: [contents._id]
    }),
    person: one(person, {
        fields: [directors.personId],
        references: [person._id]
    })
}))

export const castsRelations = relations(casts, ({ one }) => ({
    content: one(contents, {
        fields: [casts.contentId],
        references: [contents._id]
    }),
    person: one(person, {
        fields: [casts.personId],
        references: [person._id]
    })
}))
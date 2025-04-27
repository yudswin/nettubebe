import { mysqlTable, varchar, decimal, int, mysqlEnum, date, json, boolean } from "drizzle-orm/mysql-core";

const contentType = ['movie', 'tvshow'];
const status = ['upcoming', 'finish', 'updating'];

export const contents = mysqlTable('contents', {
    _id: varchar('_id', { length: 12 }).primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    originTitle: varchar('origin_title', { length: 255 }),
    englishTitle: varchar('english_title', { length: 255 }),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    overview: varchar('overview', { length: 255 }).notNull(),
    imdbRating: decimal('imdb_rating', { precision: 3, scale: 1 }).notNull().default("0.0"),
    lastestEpisode: int('lastest_episode'),
    lastestSeason: int('lastest_season'),
    rating: decimal('rating', { precision: 2, scale: 1 }).notNull().default("0.0"),
    runtime: int('runtime'),
    releaseDate: date('release_date').notNull(),
    year: int('year').notNull(),
    publish: boolean('publish').notNull().default(false),
    thumbnailPath: varchar('thumbnail_path', { length: 255 }),
    bannerPath: varchar('banner_path', { length: 255 }),
    type: mysqlEnum('type', ['movie', 'tvshow']).notNull(),
    status: mysqlEnum('status', ['upcoming', 'finish', 'updating']).notNull(),
});

export type Content = typeof contents.$inferSelect;
export type NewContent = typeof contents.$inferInsert;
export type ContentStatus = typeof status[number]
export type ContentType = typeof contentType[number]
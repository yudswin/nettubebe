import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import { genres, NewGenres } from '@schema/sql/genres.schema';
import { countries, NewCountry } from '@schema/sql/countries.schema';
import { departments, NewDepartment } from '@schema/sql/departments.schema';
import { NewPerson, person } from '@schema/sql/person.schema';
import { NewPersonDepartment, personDepartment } from '@schema/sql/personDepartment.schema';
import { contents, NewContent } from '@schema/sql/contents.schema';
import { collections, NewCollection } from '@schema/sql/collections.schema';
import { collectionContent, NewCollectionContent } from '@schema/sql/collectionContent.schema';
import { imgs, NewImage } from '@schema/sql/imgs.schema';
import { NewUser, users } from '@schema/sql/users.schema';

dotenv.config();

async function initializeDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 11162,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });
    return drizzle(connection);
}

function loadCsv<T>(filePath: string, mapper: (row: Record<string, string>) => T): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const out: T[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', row => out.push(mapper(row)))
            .on('end', () => resolve(out))
            .on('error', reject);
    });
}

async function seedGenres() {
    const db = await initializeDatabase();
    const csvPath = path.resolve(__dirname, './data/genres.csv');

    await db.delete(genres)
    const records = await loadCsv<NewGenres>(csvPath, row => ({
        _id: row._id,
        name: row.name,
        englishName: row.english_name,
        slug: row.slug,
    }));

    if (records.length === 0) {
        console.warn('⚠️ No genres to insert; skipping genres seed.');
        return;
    }

    console.log(`✅ Inserting ${records.length} genres...`);
    await db.insert(genres).values(records);
    console.log('🎉 Seeded genres successfully.');
}


async function seedCountries() {
    const db = await initializeDatabase();
    const csvPath = path.resolve(__dirname, './data/countries.csv');

    await db.delete(countries)
    const records = await loadCsv<NewCountry>(csvPath, row => ({
        _id: row._id,
        name: row.name,
        code: row.code,
        slug: row.slug,
    }));

    if (records.length === 0) {
        console.warn('⚠️ No countries to insert; skipping countries seed.');
        return;
    }

    console.log(`✅ Inserting ${records.length} countries...`);
    await db.insert(countries).values(records);
    console.log('🎉 Seeded countries successfully.');
}

async function seedDepartments() {
    const db = await initializeDatabase();
    const csvPath = path.resolve(__dirname, './data/departments.csv');

    await db.delete(departments)
    const records = await loadCsv<NewDepartment>(csvPath, row => ({
        _id: row._id,
        name: row.name,
        slug: row.slug,
    }));

    if (records.length === 0) {
        console.warn('⚠️ No department to insert; skipping department seed.');
        return;
    }

    console.log(`✅ Inserting ${records.length} departments...`);
    await db.insert(departments).values(records);
    console.log('🎉 Seeded departments successfully.');
}

async function seedImgs() {
    const db = await initializeDatabase();
    await db.delete(imgs);

    try {
        const jsonPath = path.resolve(__dirname, './data/imgs.json');
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as any[];
        
        if (jsonData.length === 0) {
            console.warn('⚠️ No images to insert; skipping images seed.');
            return;
        }
        
        const records: NewImage[] = jsonData.map(item => ({
            _id: item._id,
            imgurId: item.imgur_id,
            deleteHash: item.delete_hash,
            path: item.path,
            type: item.type as "avatar" | "person" | "thumbnail" | "banner",
            metadata: item.metadata
        }));

        console.log(`✅ Inserting ${records.length} images...`);
        await db.insert(imgs).values(records);
        console.log('🎉 Seeded images successfully.');
    } catch (error) {
        console.error('❌ Error seeding images:', error);
    }
}

async function seedContents() {
    const db = await initializeDatabase();
    await db.delete(contents)
    const csvPath = path.resolve(__dirname, './data/contents2.csv');
    const records = await loadCsv<NewContent>(csvPath, row => ({
        _id: row._id,
        title: row.title,
        originTitle: row.origin_title,
        englishTitle: row.english_title,
        slug: row.slug,
        overview: row.overview,
        releaseDate: new Date(row.release_date),
        year: parseInt(row.year),
        type: row.type as "movie" | "tvshow",
        status: row.status as "upcoming" | "finish" | "updating",
        publish: row.publish === "True" ? true : false,
        thumbnailPath: row.thumbnail_path,
        bannerPath: row.banner_path,
        runtime: parseInt(row.runtime)
    }));

    if (records.length === 0) {
        console.warn('⚠️ No contents to insert; skipping contents seed.');
        return;
    }

    console.log(`✅ Inserting ${records.length} contents...`);
    await db.insert(contents).values(records);
    console.log('🎉 Seeded contents successfully.');
}

async function seedCollections() {
    const db = await initializeDatabase();
    await db.delete(collections)
    const csvPath = path.resolve(__dirname, './data/collections.csv');
    const records = await loadCsv<NewCollection>(csvPath, row => ({
        _id: row._id,
        name: row.name,
        slug: row.slug,
        type: row.type as "topic" | "hot" | "features",
        description: row.description,
        publish: row.publish === "True" ? true : false,
    }));

    if (records.length === 0) {
        console.warn('⚠️ No collection to insert; skipping collection seed.');
        return;
    }

    console.log(`✅ Inserting ${records.length} collections...`);
    await db.insert(collections).values(records);
    console.log('🎉 Seeded collections successfully.');
}

async function seedUsers() {
    const db = await initializeDatabase();
    await db.delete(users);
    const existingImgs = await db.select({ _id: imgs._id }).from(imgs);
    const validImgIds = new Set(existingImgs.map(img => img._id));

    const csvPath = path.resolve(__dirname, './data/users.csv');
    const records = await loadCsv<NewUser>(csvPath, row => {
        const avatarId = row.avatar_id && validImgIds.has(row.avatar_id) ? row.avatar_id : null;

        return {
            _id: row._id,
            name: row.name,
            email: row.email,
            password: row.password,
            avatarId: avatarId,
            token: row.token || null,
            roles: (row.roles || 'user') as "user" | "admin" | "moderator",
            gender: (row.gender || 'none') as "male" | "female" | "none",
            isVerified: row.is_verified === "true",
            isActive: row.is_active === "true" || true
        };
    });

    if (records.length === 0) {
        console.warn('⚠️ No users to insert; skipping users seed.');
        return;
    }

    console.log(`✅ Inserting ${records.length} users...`);
    await db.insert(users).values(records);
    console.log('🎉 Seeded users successfully.');
}

async function seedPerson() {
    const db = await initializeDatabase();
    const csvPath = path.resolve(__dirname, './data/persons.csv');

    await db.delete(person)
    const records = await loadCsv<NewPerson>(csvPath, row => ({
        _id: row._id,
        name: row.name,
        slug: row.slug,
        profilePath: row.profile_path ? row.profile_path : null
    }));
    if (records.length === 0) {
        console.warn('⚠️ No person to insert; skipping person seed.');
        return;
    }

    await db.delete(personDepartment)
    const junctions = await loadCsv<NewPersonDepartment>(csvPath, row => ({
        personId: row._id,
        departmentId: row.department_id
    }))
    if (junctions.length == 0) {
        console.warn('⚠️ No personDepartment to insert; skipping personDepartment seed.');
        return;
    }

    console.log(`✅ Inserting ${records.length} person...`);
    await db.insert(person).values(records);
    console.log(`✅ Inserting ${junctions.length} personDepartment...`);
    await db.insert(personDepartment).values(junctions);

    console.log('🎉 Seeded persons & personDepartment successfully.');
}

async function seedCollectionsContent() {
    const db = await initializeDatabase();

    await db.delete(collectionContent);

    const csvPath = path.resolve(__dirname, './data/collectionContents.csv');
    const records = await loadCsv<NewCollectionContent>(csvPath, row => ({
        collectionId: row.collection_id,
        contentId: row.content_id,
    }));

    if (records.length === 0) {
        console.warn('⚠️ No contents to insert; skipping contents seed.');
        return;
    }

    console.log(`✅ Inserting ${records.length} collection-content relationships...`);

    try {
        await db.insert(collectionContent).values(records);
    } catch (error) {
        console.error('Error inserting collection contents:', error);

        console.log('Trying to insert records one by one to identify issues...');
        for (const record of records) {
            try {
                await db.insert(collectionContent).values(record);
            } catch (e) {
                console.error(`Failed to insert: collectionId=${record.collectionId}, contentId=${record.contentId}`);
            }
        }
    }

    console.log('🎉 Seeded collection contents successfully.');
}

async function main() {
    console.log('🚀 Starting data seeding...');
    await seedGenres();
    await seedCountries();
    await seedDepartments();
    await seedPerson();
    await seedCollections()
    await seedContents();
    await seedCollectionsContent()
    await seedUsers();
    await seedImgs()
    console.log('🏁 All seeds completed.');
}

main().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});

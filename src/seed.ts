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

async function seedContents() {
    const db = await initializeDatabase();
    const csvPath = path.resolve(__dirname, './data/contents.csv');

    await db.delete(contents)
    const records = await loadCsv<NewContent>(csvPath, row => ({
        _id: row._id,
        title: row.title,
        originTitle: row.originTitle,
        englishTitle: row.englishTitle,
        slug: row.slug,
        overview: row.overview,
        imdbRating: row.imdbRating,
        releaseDate: new Date(row.releaseDate),
        year: parseInt(row.year),
        type: row.type as "movie" | "tvshow",
        status: row.status as "upcoming" | "finish" | "updating",
        publish: row.publish === "True" ? true : false,
        thumbnailPath: row.thumbnailPath,
        bannerPath: row.bannerPath,
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

async function main() {
    console.log('🚀 Starting data seeding...');
    await seedGenres();
    await seedCountries();
    await seedDepartments();
    await seedPerson();
    await seedContents();
    console.log('🏁 All seeds completed.');
}

main().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});

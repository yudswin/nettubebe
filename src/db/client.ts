import { neon } from "@neondatabase/serverless";
import mysql from 'mysql2/promise';
import { drizzle as drizzlePg } from "drizzle-orm/neon-http";
import { drizzle as drizzleMySql } from "drizzle-orm/mysql2";

let dbInstance: DBClient | null = null;

type DBClient =
    | { client: Awaited<ReturnType<typeof getMysqlClient>>, type: "mysql" }
    | { client: ReturnType<typeof getPostgresClient>, type: "postgres" };

export const getDBClient = async (): Promise<void> => {
    try {
        switch (process.env.NODE_ENV) {
            case "development": {
                const client = await getMysqlClient();
                dbInstance = { client, type: "mysql" };
                break;
            }
            default: {
                const client = getPostgresClient();
                dbInstance = { client, type: "postgres" };
                break;
            }
        }
        console.log(`Database connected (${dbInstance.type})`);
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

async function getMysqlClient() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });
    return drizzleMySql(connection);
}

function getPostgresClient() {
    const pg = neon(process.env.DATABASE_URL!);
    return drizzlePg({
        client: pg
    });
}

export const getDB = (): DBClient => {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call initializeDB() first.');
    }
    return dbInstance;
};


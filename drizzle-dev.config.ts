import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
    out: './drizzle/mysql',
    dialect: "mysql",
    schema: "./src/models/mysql/*.schema.ts",
    dbCredentials: {
        url: process.env.MYSQL_URL!,
    }
});
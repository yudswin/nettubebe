import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { getDBClient } from "./db/client";
import { routes } from "./routes";
dotenv.config()

const PORT = process.env.PORT || 3000;
const app = express()

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use('/', routes)

async function main() {
    // Initialize DB Instances
    try {
        await getDBClient();
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}

main();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


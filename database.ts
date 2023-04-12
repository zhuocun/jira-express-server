import mongoose from "mongoose";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import * as dotenv from "dotenv";
import EDatabase from "./constants/eDatabase.js";
import pg from "pg";

import ETableName from "./constants/eTableName.js";
import { createDynamoDBTable } from "./utils/database/dynamoDB.util.js";
import EPGCreateTableQuery from "./constants/ePGCreateTableQuery.js";
const { Pool } = pg;
dotenv.config();
const database = process.env.DATABASE as string;

let dynamoDBDocument: DynamoDBDocument;
let dynamoDBClient: DynamoDBClient;
let postgresPool: pg.Pool;

export const connectToDatabase = async (): Promise<void> => {
    switch (database) {
        case EDatabase.MONGODB:
            await mongoose.connect(
                process.env.MONGO_URI != null ? process.env.MONGO_URI : ""
            );
            break;
        case EDatabase.DYNAMODB:
            await (async () => {
                dynamoDBClient = new DynamoDBClient({
                    region: process.env.AWS_REGION,
                    credentials: {
                        accessKeyId:
                            process.env.AWS_ACCESS_KEY_ID != null
                                ? process.env.AWS_ACCESS_KEY_ID
                                : "",
                        secretAccessKey:
                            process.env.AWS_SECRET_ACCESS_KEY != null
                                ? process.env.AWS_SECRET_ACCESS_KEY
                                : ""
                    }
                });
                dynamoDBDocument = DynamoDBDocument.from(dynamoDBClient);
                const tableNames = Object.values(ETableName);
                for (const tableName of tableNames) {
                    await createDynamoDBTable(tableName);
                }
            })();
            break;
        case EDatabase.POSTGRESQL:
            await (async () => {
                postgresPool = new Pool({
                    user: process.env.POSTGRES_USER,
                    host: process.env.POSTGRES_HOST,
                    database: process.env.POSTGRES_DATABASE,
                    password: process.env.POSTGRES_PASSWORD,
                    port: parseInt(
                        process.env.POSTGRES_PORT != null
                            ? process.env.POSTGRES_PORT
                            : "5432"
                    ),
                    ssl: {
                        rejectUnauthorized: false
                    }
                });
                await postgresPool.connect();
                const queries = Object.values(EPGCreateTableQuery);
                for (const query of queries) {
                    await postgresPool.query(query);
                }
            })();
            break;
        default:
            throw new Error(`Unknown database: ${database}`);
    }
};

export { database, dynamoDBClient, dynamoDBDocument, postgresPool };

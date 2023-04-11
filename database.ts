import mongoose from "mongoose";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import AWS from "aws-sdk";
import * as dotenv from "dotenv";
import EDatabase from "./constants/eDatabase.js";
import pg from "pg";
const { Pool } = pg;
dotenv.config();
const database = process.env.DATABASE as string;

let dynamoDBDocument: DynamoDBDocument;
let dynamoDB: DynamoDB;
let postgresPool: pg.Pool;

export const connectToDatabase = async (): Promise<void> => {
    switch (database) {
        case EDatabase.MONGODB:
            await mongoose.connect(
                process.env.MONGO_URI != null ? process.env.MONGO_URI : ""
            );
            break;
        case EDatabase.DYNAMODB:
            AWS.config.update({
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            });
            dynamoDB = new DynamoDB({ region: process.env.AWS_REGION });
            dynamoDBDocument = DynamoDBDocument.from(dynamoDB);
            break;
        case EDatabase.POSTGRESQL:
            postgresPool = new Pool({
                user: process.env.POSTGRES_USER,
                host: process.env.POSTGRES_HOST,
                database: process.env.POSTGRES_DATABASE,
                password: process.env.POSTGRES_PASSWORD,
                port: parseInt(process.env.POSTGRES_PORT != null ? process.env.POSTGRES_PORT : "5432"),
                ssl: {
                    rejectUnauthorized: false // Set to true if you want to verify server certificates
                }
            });
            try {
                await postgresPool.connect();
            } catch (err) {
                console.log(err);
            }
            break;
        default:
            throw new Error(`Unknown database: ${database}`);
    }
};

export { database, dynamoDB, dynamoDBDocument, postgresPool };

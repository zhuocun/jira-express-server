import mongoose from "mongoose";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import AWS from "aws-sdk";
import * as dotenv from "dotenv";
import EDatabase from "./constants/eDatabase.js";

dotenv.config();
const database = process.env.DATABASE as string;

let dynamoDBDocument: DynamoDBDocument;
let dynamoDB: DynamoDB;

export const connectToDatabase = async (): Promise<void> => {
    switch (database) {
        case EDatabase.MONGO_DB:
            await mongoose.connect(
                process.env.MONGO_URI != null ? process.env.MONGO_URI : ""
            );
            break;
        case EDatabase.DYNAMO_DB:
            AWS.config.update({
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            });
            dynamoDB = new DynamoDB({ region: process.env.AWS_REGION });
            dynamoDBDocument = DynamoDBDocument.from(dynamoDB);
            break;
        default:
            throw new Error(`Unknown database: ${database}`);
    }
};

export { database, dynamoDB, dynamoDBDocument };

import mongoose from "mongoose";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import AWS from "aws-sdk";
import * as dotenv from "dotenv";

dotenv.config();
const database = process.env.DATABASE as string;

let dynamoDBDocument: DynamoDBDocument;
let dynamoDB: DynamoDB;

export const connectToDatabase = async (): Promise<void> => {
    switch (database) {
        case "mongoDB":
            await mongoose.connect((process.env.MONGO_URI != null) ? process.env.MONGO_URI : "");
            break;
        case "dynamoDB":
            AWS.config.update({
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            });
            dynamoDBDocument = DynamoDBDocument.from(
                new DynamoDB({ region: process.env.AWS_REGION })
            );
            dynamoDB = new DynamoDB({ region: process.env.AWS_REGION });
            break;
        default:
            throw new Error(`Unknown database: ${database}`);
    }
};

export { database, dynamoDB, dynamoDBDocument };

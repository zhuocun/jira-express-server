import { dynamoDBDocument } from "../app.js";
import * as dotenv from "dotenv";
import userModel from "../models/user.model.js";
import AWS from "aws-sdk";
dotenv.config();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const database = process.env.DATABASE;
const create = async <P>(reqBody: P, tableName: string): Promise<void> => {
    if (database === "dynamoDB") {
        await dynamoDBDocument.put({
            TableName: tableName,
            Item: reqBody as any
        });
    }
    if (database === "mongoDB") {
        switch (tableName) {
            case "User":
                await userModel.create(reqBody);
                break;
            default:
                break;
        }
    }
};

export { create };

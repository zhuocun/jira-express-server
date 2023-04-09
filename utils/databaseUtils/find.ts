import { ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { database, dynamoDBDocument } from "../../database.js";

import { DocumentDefinition } from "mongoose";
import userModel from "../../models/user.model.js";
import projectModel from "../../models/project.model.js";
import EDatabase from "../../constants/eDatabase.js";
import { buildExpression } from "./dynamo.util.js";
import ETableName from "../../constants/eTableName.js";
import EError from "../../constants/error.js";

const findDynamoDB = async (
    reqBody: Record<string, any>,
    tableName: string
): Promise<Array<Record<string, any>> | undefined> => {
    const {
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        expression: FilterExpression
    } = buildExpression(reqBody);

    const params: ScanCommandInput = {
        TableName: tableName,
        FilterExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues
    };

    const command = new ScanCommand(params);
    const response = await dynamoDBDocument.send(command);
    return response.Items != null ? response.Items : undefined;
};

const findMongoDB = async <P>(
    reqBody: P,
    tableName: string
): Promise<Array<Record<string, any>> | undefined> => {
    let res: unknown;
    switch (tableName) {
        case ETableName.USER:
            res = await userModel.find(reqBody as DocumentDefinition<P>);
            break;
        case ETableName.PROJECT:
            res = await projectModel.find(reqBody as DocumentDefinition<P>);
            break;
        default:
            res = null;
            break;
    }
    return res as Array<Record<string, any>>;
};

const find = async (
    reqBody: Record<string, any>,
    tableName: string
): Promise<Array<Record<string, any>> | undefined> => {
    try {
        switch (database) {
            case EDatabase.DYNAMO_DB:
                return await findDynamoDB(reqBody, tableName);
            case EDatabase.MONGO_DB:
                return await findMongoDB(reqBody, tableName);
            default:
                throw new Error(EError.INVALID_DB);
        }
    } catch (error) {
        console.error("Error finding items by attributes:", error);
    }
};

export default find;

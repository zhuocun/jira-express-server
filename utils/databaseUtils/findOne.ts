import { ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { database, dynamoDBDocument } from "../../database.js";
import userModel from "../../models/user.model.js";
import { DocumentDefinition } from "mongoose";
import projectModel from "../../models/project.model.js";
import EDatabase from "../../constants/eDatabase.js";
import { buildExpression } from "./dynamo.util.js";
import EError from "../../constants/error.js";
import ETableName from "../../constants/eTableName.js";

const findOneDynamoDB = async (
    reqBody: Record<string, any>,
    tableName: string
): Promise<Record<string, any> | undefined> => {
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
    return response.Items != null ? response.Items[0] : undefined;
};

const findOneMongoDB = async <P>(
    reqBody: P,
    tableName: string
): Promise<Record<string, any> | undefined> => {
    let res: unknown;
    switch (tableName) {
        case ETableName.USER:
            res = await userModel.findOne(reqBody as DocumentDefinition<P>);
            break;
        case ETableName.PROJECT:
            res = await projectModel.findOne(reqBody as DocumentDefinition<P>);
            break;
        default:
            res = null;
            break;
    }
    return res as Record<string, any>;
};

const findOne = async (
    reqBody: Record<string, any>,
    tableName: string
): Promise<Record<string, any> | undefined> => {
    try {
        switch (database) {
            case EDatabase.DYNAMO_DB:
                return await findOneDynamoDB(reqBody, tableName);
            case EDatabase.MONGO_DB:
                return await findOneMongoDB(reqBody, tableName);
            default:
                throw new Error(EError.INVALID_DB);
        }
    } catch (error) {
        console.error("Error finding one item by attributes:", error);
    }
};

export default findOne;

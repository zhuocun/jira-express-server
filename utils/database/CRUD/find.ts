import { ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { database, dynamoDBDocument } from "../../../database.js";

import { DocumentDefinition } from "mongoose";
import userModel from "../../../models/user.model.js";
import projectModel from "../../../models/project.model.js";
import EDatabase from "../../../constants/eDatabase.js";
import { buildExpression } from "../dynamoDB.util.js";
import ETableName from "../../../constants/eTableName.js";
import EError from "../../../constants/eError.js";

const findDynamoDB = async <P>(
    reqBody: Partial<P>,
    tableName: string
): Promise<Array<P & { _id: string }> | undefined> => {
    let params: ScanCommandInput;
    if (Object.keys(reqBody as Record<string, any>).length > 0) {
        const {
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            expression: FilterExpression
        } = buildExpression(reqBody as Record<string, any>);

        params = {
            TableName: tableName,
            FilterExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        };
    } else {
        params = {
            TableName: tableName
        };
    }

    try {
        const command = new ScanCommand(params);
        const response = await dynamoDBDocument.send(command);
        return response.Items != null
            ? (response.Items as Array<P & { _id: string }>)
            : undefined;
    } catch (error) {
        return undefined;
    }
};

const findMongoDB = async <P>(
    reqBody: Partial<P>,
    tableName: string
): Promise<Array<P & { _id: string }> | undefined> => {
    let res: Array<P & { _id: string }>;
    switch (tableName) {
        case ETableName.USER:
            res = await userModel.find(reqBody as DocumentDefinition<P>);
            break;
        case ETableName.PROJECT:
            res = await projectModel.find(reqBody as DocumentDefinition<P>);
            break;
        default:
            res = [];
            break;
    }
    return res.length !== 0 ? res : undefined;
};

const find = async <P>(
    reqBody: Partial<P>,
    tableName: string
): Promise<Array<P & { _id: string }> | undefined> => {
    try {
        switch (database) {
            case EDatabase.DYNAMODB:
                return await findDynamoDB(reqBody, tableName);
            case EDatabase.MONGODB:
                return await findMongoDB(reqBody, tableName);
            default:
                throw new Error(EError.INVALID_DB);
        }
    } catch (error) {
        console.error("Error finding items by attributes:", error);
    }
};

export default find;
import { ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { database, dynamoDBDocument } from "../../../database.js";
import userModel from "../../../models/user.model.js";
import { DocumentDefinition } from "mongoose";
import projectModel from "../../../models/project.model.js";
import EDatabase from "../../../constants/eDatabase.js";
import { buildExpression } from "../dynamoDB.util.js";
import EError from "../../../constants/eError.js";
import ETableName from "../../../constants/eTableName.js";
import taskModel from "../../../models/task.model.js";
import columnModel from "../../../models/column.model.js";

const findOneDynamoDB = async <P>(
    reqBody: Partial<P>,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    let params: ScanCommandInput;
    if (Object.keys(reqBody).length > 0) {
        const {
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            expression: FilterExpression
        } = buildExpression(reqBody);

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

    const command = new ScanCommand(params);
    const response = await dynamoDBDocument.send(command);
    return response.Items != null
        ? (response.Items[0] as P & { _id: string })
        : undefined;
};

const findOneMongoDB = async <P>(
    reqBody: Partial<P>,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    let res: (P & { _id: string }) | null;
    switch (tableName) {
        case ETableName.USER:
            res = await userModel.findOne(reqBody as DocumentDefinition<P>);
            break;
        case ETableName.PROJECT:
            res = await projectModel.findOne(reqBody as DocumentDefinition<P>);
            break;
        case ETableName.TASK:
            res = await taskModel.findOne(reqBody as DocumentDefinition<P>);
            break;
        case ETableName.COLUMN:
            res = await columnModel.findOne(reqBody as DocumentDefinition<P>);
            break;
        default:
            res = null;
            break;
    }
    return res != null ? res : undefined;
};

const findOne = async <P>(
    reqBody: Partial<P>,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    try {
        switch (database) {
            case EDatabase.DYNAMODB:
                return await findOneDynamoDB(reqBody, tableName);
            case EDatabase.MONGODB:
                return await findOneMongoDB(reqBody, tableName);
            default:
                throw new Error(EError.INVALID_DB);
        }
    } catch (error) {
        console.error("Error finding one item by attributes:", error);
    }
};

export default findOne;

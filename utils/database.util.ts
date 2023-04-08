import { ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { database, dynamoDBDocument } from "../app.js";
import userModel from "../models/user.model.js";
import { DocumentDefinition } from "mongoose";
import { v4 } from "uuid";
import projectModel from "../models/project.model.js";

const create = async <P>(reqBody: P, tableName: string): Promise<void> => {
    if (database === "dynamoDB") {
        await dynamoDBDocument.put({
            TableName: tableName,
            Item: { ...(reqBody as Record<string, any>), _id: v4() }
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

const findOneDynamoDB = async (
    reqBody: Record<string, any>,
    tableName: string
): Promise<Record<string, any> | undefined> => {
    const expressionAttributeNames: Record<string, any> = {};
    const expressionAttributeValues: Record<string, any> = {};
    const filterExpressions: string[] = [];
    Object.keys(reqBody).forEach((attributeName, index) => {
        const nameKey = `#attrName${index}`;
        const valueKey = `:attrValue${index}`;

        expressionAttributeNames[nameKey] = attributeName;
        expressionAttributeValues[valueKey] = reqBody[attributeName];
        filterExpressions.push(`${nameKey} = ${valueKey}`);
    });

    const params: ScanCommandInput = {
        TableName: tableName,
        FilterExpression: filterExpressions.join(" AND "),
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
    };

    const command = new ScanCommand(params);
    const response = await dynamoDBDocument.send(command);
    return response.Items != null
        ? response.Items[0]
        : undefined;
};

const findOneMongoDB = async <P>(
    reqBody: P,
    tableName: string
): Promise<Record<string, any> | undefined> => {
    let res: unknown;
    switch (tableName) {
        case "User":
            res = await userModel.findOne(reqBody as DocumentDefinition<P>);
            break;
        case "Project":
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
        if (database === "dynamoDB") {
            return await findOneDynamoDB(reqBody, tableName);
        }
        if (database === "mongoDB") {
            return await findOneMongoDB(reqBody, tableName);
        }
    } catch (error) {
        console.error("Error getting items by attributes:", error);
    }
};

export { create, findOne };

import { ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { database, dynamoDBDocument } from "../app.js";
import userModel from "../models/user.model.js";
import { DocumentDefinition } from "mongoose";
import { v4 } from "uuid";

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

const findOne = async <P>(reqBody: P, tableName: string): Promise<P | undefined> => {
    if (database === "dynamoDB") {
        try {
            const expressionAttributeNames: Record<string, any> = {};
            const expressionAttributeValues: Record<string, any> = {};
            const filterExpressions: string[] = [];
            const filters = reqBody as Record<string, any>;
            Object.keys(filters).forEach((attributeName, index) => {
                const nameKey = `#attrName${index}`;
                const valueKey = `:attrValue${index}`;

                expressionAttributeNames[nameKey] = attributeName;
                expressionAttributeValues[valueKey] = filters[attributeName];
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
            return response.Items != null ? response.Items[0] as P : undefined;
        } catch (error) {
            console.error("Error getting items by attributes:", error);
        }
    }
    if (database === "mongoDB") {
        switch (tableName) {
            case "User":
                return (await userModel.findOne(reqBody as DocumentDefinition<P>))?.toJSON() as P;
            default:
                break;
        }
    }
};

export { create, findOne };

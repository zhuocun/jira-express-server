import { UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { database, dynamoDBDocument } from "../../database.js";
import { buildExpression } from "./dynamo.util.js";

import { DocumentDefinition } from "mongoose";
import userModel from "../../models/user.model.js";
import projectModel from "../../models/project.model.js";
import EDatabase from "../../constants/eDatabase.js";
import EError from "../../constants/error.js";
import ETableName from "../../constants/eTableName.js";

const findByIdAndUpdateDynamoDB = async <P>(
    _id: string,
    updateFields: Partial<P>,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    const { ExpressionAttributeNames, ExpressionAttributeValues, expression } =
        buildExpression(updateFields);

    const params: UpdateCommandInput = {
        TableName: tableName,
        Key: { _id },
        UpdateExpression: `SET ${expression.replaceAll("AND", ",")}`,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW"
    };

    const command = new UpdateCommand(params);
    const response = await dynamoDBDocument.send(command);

    return response.Attributes != null
        ? (response.Attributes as P & { _id: string })
        : undefined;
};

const findByIdAndUpdateMongoDB = async <P>(
    _id: string,
    updateFields: Partial<P>,
    tableName: string,
    options?: Record<string, any>
): Promise<(P & { _id: string }) | undefined> => {
    let res: (P & { _id: string }) | null;
    switch (tableName) {
        case ETableName.USER:
            res = await userModel.findByIdAndUpdate(
                _id,
                updateFields as DocumentDefinition<Partial<P>>,
                { new: true, ...options }
            );
            break;
        case ETableName.PROJECT:
            res = await projectModel.findByIdAndUpdate(
                _id,
                updateFields as DocumentDefinition<Partial<P>>,
                { new: true, ...options }
            );
            break;
        default:
            res = null;
            break;
    }
    return res != null ? res : undefined;
};

const findByIdAndUpdate = async <P>(
    _id: string,
    updateFields: Partial<P>,
    tableName: string,
    options?: Record<string, any>
): Promise<(P & { _id: string }) | undefined> => {
    try {
        switch (database) {
            case EDatabase.DYNAMO_DB:
                return await findByIdAndUpdateDynamoDB<P>(
                    _id,
                    updateFields,
                    tableName
                );
            case EDatabase.MONGO_DB:
                return await findByIdAndUpdateMongoDB<P>(
                    _id,
                    updateFields,
                    tableName,
                    options
                );
            default:
                throw new Error(EError.INVALID_DB);
        }
    } catch (error) {
        console.error("Error finding item by id and update:", error);
    }
};

export default findByIdAndUpdate;

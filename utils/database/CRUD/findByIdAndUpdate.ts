import { UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { database, dynamoDBDocument, postgresPool } from "../../../database.js";
import { buildExpression } from "../dynamoDB.util.js";

import { DocumentDefinition } from "mongoose";
import userModel from "../../../models/user.model.js";
import projectModel from "../../../models/project.model.js";
import EDatabase from "../../../constants/eDatabase.js";
import EError from "../../../constants/eError.js";
import ETableName from "../../../constants/eTableName.js";
import taskModel from "../../../models/task.model.js";
import columnModel from "../../../models/column.model.js";

const findByIdAndUpdatePostgreSQL = async <P>(
    _id: string,
    updateFields: Partial<P>,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    const setValues = Object.entries(updateFields)
        .map(([key, _], idx) => `"${key}" = $${idx + 2}`)
        .join(", ");
    // query: UPDATE tableName SET key1 = $2, key2 = $3 WHERE _id = $1 RETURNING *
    const query = `UPDATE ${tableName} SET ${setValues} WHERE _id = $1 RETURNING *`;

    const { rows } = await postgresPool.query(query, [
        _id,
        ...Object.values(updateFields)
    ]);
    return rows.length === 1 ? rows[0] : undefined;
};

const findByIdAndUpdateDynamoDB = async <P>(
    _id: string,
    updateFields: Partial<P>,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    if ("_id" in updateFields) {
        delete updateFields._id;
    }
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
        case ETableName.TASK:
            res = await taskModel.findByIdAndUpdate(
                _id,
                updateFields as DocumentDefinition<Partial<P>>,
                { new: true, ...options }
            );
            break;
        case ETableName.COLUMN:
            res = await columnModel.findByIdAndUpdate(
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
            case EDatabase.POSTGRESQL:
                return await findByIdAndUpdatePostgreSQL<P>(
                    _id,
                    updateFields,
                    tableName
                );
            case EDatabase.DYNAMODB:
                return await findByIdAndUpdateDynamoDB<P>(
                    _id,
                    updateFields,
                    tableName
                );
            case EDatabase.MONGODB:
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

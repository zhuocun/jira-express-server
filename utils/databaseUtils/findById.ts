import { GetCommand, GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { database, dynamoDBDocument } from "../../database.js";

import userModel from "../../models/user.model.js";
import projectModel from "../../models/project.model.js";
import EDatabase from "../../constants/eDatabase.js";
import EError from "../../constants/error.js";

const findByIdDynamoDB = async (
    _id: string,
    tableName: string
): Promise<Record<string, any> | undefined> => {
    const params: GetCommandInput = {
        TableName: tableName,
        Key: { id: _id }
    };

    const command = new GetCommand(params);
    const response = await dynamoDBDocument.send(command);

    return response.Item != null ? response.Item : undefined;
};

const findByIdMongoDB = async (
    _id: string,
    tableName: string
): Promise<Record<string, any> | undefined> => {
    let res: unknown;
    switch (tableName) {
        case "User":
            res = await userModel.findById(_id);
            break;
        case "Project":
            res = await projectModel.findById(_id);
            break;
        default:
            res = null;
            break;
    }
    return res as Record<string, any>;
};

const findById = async (
    _id: string,
    tableName: string
): Promise<Record<string, any> | undefined> => {
    try {
        switch (database) {
            case EDatabase.DYNAMO_DB:
                return await findByIdDynamoDB(_id, tableName);
            case EDatabase.MONGO_DB:
                return await findByIdMongoDB(_id, tableName);
            default:
                throw new Error(EError.INVALID_DB);
        }
    } catch (error) {
        console.error("Error finding item by id:", error);
    }
};

export default findById;

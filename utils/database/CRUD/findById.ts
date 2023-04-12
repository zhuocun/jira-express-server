import { GetCommand, GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { database, dynamoDBDocument, postgresPool } from "../../../database.js";

import userModel from "../../../models/user.model.js";
import projectModel from "../../../models/project.model.js";
import EDatabase from "../../../constants/eDatabase.js";
import EError from "../../../constants/eError.js";
import ETableName from "../../../constants/eTableName.js";
import taskModel from "../../../models/task.model.js";
import columnModel from "../../../models/column.model.js";

const findByIdPostgreSQL = async <P>(
    _id: string,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    // query: SELECT * FROM tableName WHERE _id = $1
    const query = `SELECT * FROM ${tableName} WHERE _id = $1`;

    const { rows } = await postgresPool.query(query, [_id]);
    return rows.length === 1 ? rows[0] : undefined;
};

const findByIdDynamoDB = async <P>(
    _id: string,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    const params: GetCommandInput = {
        TableName: tableName,
        Key: { _id }
    };

    const command = new GetCommand(params);
    const response = await dynamoDBDocument.send(command);

    return response.Item != null
        ? (response.Item as P & { _id: string })
        : undefined;
};

const findByIdMongoDB = async <P>(
    _id: string,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    let res: (P & { _id: string }) | null;
    switch (tableName) {
        case ETableName.USER:
            res = await userModel.findById(_id);
            break;
        case ETableName.PROJECT:
            res = await projectModel.findById(_id);
            break;
        case ETableName.TASK:
            res = await taskModel.findById(_id);
            break;
        case ETableName.COLUMN:
            res = await columnModel.findById(_id);
            break;
        default:
            res = null;
            break;
    }
    return res != null ? res : undefined;
};

const findById = async <P>(
    _id: string,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    try {
        switch (database) {
            case EDatabase.POSTGRESQL:
                return await findByIdPostgreSQL<P>(_id, tableName);
            case EDatabase.DYNAMODB:
                return await findByIdDynamoDB<P>(_id, tableName);
            case EDatabase.MONGODB:
                return await findByIdMongoDB<P>(_id, tableName);
            default:
                throw new Error(EError.INVALID_DB);
        }
    } catch (error) {
        console.error("Error finding item by id:", error);
    }
};

export default findById;

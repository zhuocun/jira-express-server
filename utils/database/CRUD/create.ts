import EDatabase from "../../../constants/eDatabase.js";
import EError from "../../../constants/eError.js";
import { database, dynamoDBDocument, postgresPool } from "../../../database.js";
import userModel from "../../../models/user.model.js";
import projectModel from "../../../models/project.model.js";
import { v4 } from "uuid";
import ETableName from "../../../constants/eTableName.js";
import taskModel from "../../../models/task.model.js";
import columnModel from "../../../models/column.model.js";

const createItemMongoDB = async <P>(
    reqBody: P,
    tableName: string
): Promise<void> => {
    switch (tableName) {
        case ETableName.USER:
            await userModel.create(reqBody);
            break;
        case ETableName.PROJECT:
            await projectModel.create(reqBody);
            break;
        case ETableName.TASK:
            await taskModel.create(reqBody);
            break;
        case ETableName.COLUMN:
            await columnModel.create(reqBody);
            break;
        default:
            break;
    }
};

const createItemDynamoDB = async <P>(
    reqBody: P,
    tableName: string
): Promise<void> => {
    await dynamoDBDocument.put({
        TableName: tableName,
        Item: {
            ...(reqBody as Record<string, any>),
            _id: v4(),
            createdAt: new Date().toISOString()
        }
    });
};

const createItemPostgreSQL = async <P>(
    reqBody: P,
    tableName: string
): Promise<void> => {
    const keys = Object.keys(reqBody as Record<string, any>);
    const values = Object.values(reqBody as Record<string, any>);

    const queryParams = keys.map((_, index) => `$${index + 1}`).join(", ");
    // query = INSERT INTO tableName (key1, key2, key3) VALUES ($1, $2, $3)
    const query = `INSERT INTO ${tableName} (${keys.join(
        ", "
    )}) VALUES (${queryParams})`;

    await postgresPool.query(query, values);
};

const createItem = async <P>(reqBody: P, tableName: string): Promise<void> => {
    switch (database) {
        case EDatabase.POSTGRESQL:
            await createItemPostgreSQL(reqBody, tableName);
            break;
        case EDatabase.DYNAMODB:
            await createItemDynamoDB(reqBody, tableName);
            break;
        case EDatabase.MONGODB:
            await createItemMongoDB(reqBody, tableName);
            break;
        default:
            throw new Error(EError.INVALID_DB);
    }
};

export default createItem;

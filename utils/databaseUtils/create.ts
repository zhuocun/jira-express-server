import EDatabase from "../../constants/eDatabase.js";
import EError from "../../constants/error.js";
import { database, dynamoDBDocument } from "../../database.js";
import userModel from "../../models/user.model.js";
import projectModel from "../../models/project.model.js";
import { v4 } from "uuid";
import ETableName from "../../constants/eTableName.js";

const createMongoDB = async <P>(
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
        default:
            break;
    }
};

const createDynamoDB = async <P>(
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

const createItem = async <P>(reqBody: P, tableName: string): Promise<void> => {
    switch (database) {
        case EDatabase.DYNAMO_DB:
            await createDynamoDB(reqBody, tableName);
            break;
        case EDatabase.MONGO_DB:
            await createMongoDB(reqBody, tableName);
            break;
        default:
            throw new Error(EError.INVALID_DB);
    }
};

export default createItem;

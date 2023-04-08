import EDatabase from "../../constants/eDatabase.js";
import { database, dynamoDBDocument } from "../../database.js";
import userModel from "../../models/user.model.js";
import { v4 } from "uuid";

const create = async <P>(reqBody: P, tableName: string): Promise<void> => {
    if (database === EDatabase.DynamoDB) {
        await dynamoDBDocument.put({
            TableName: tableName,
            Item: { ...(reqBody as Record<string, any>), _id: v4() }
        });
    }
    if (database === EDatabase.MongoDB) {
        switch (tableName) {
            case "User":
                await userModel.create(reqBody);
                break;
            default:
                break;
        }
    }
};

export default create;

import EDatabase from "../../constants/eDatabase.js";
import EError from "../../constants/error.js";
import { database, dynamoDBDocument } from "../../database.js";
import userModel from "../../models/user.model.js";
import projectModel from "../../models/project.model.js";
import { v4 } from "uuid";

const create = async <P>(reqBody: P, tableName: string): Promise<void> => {
    switch (database) {
        case EDatabase.DYNAMO_DB:
            await dynamoDBDocument.put({
                TableName: tableName,
                Item: { ...(reqBody as Record<string, any>), _id: v4() }
            });
            break;
        case EDatabase.MONGO_DB:
            switch (tableName) {
                case "User":
                    await userModel.create(reqBody);
                    break;
                case "Project":
                    await projectModel.create(reqBody);
                    break;
                default:
                    break;
            }
            break;
        default:
            throw new Error(EError.INVALID_DB);
    }
};

export default create;

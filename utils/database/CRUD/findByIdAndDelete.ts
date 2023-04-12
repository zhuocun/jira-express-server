import { DeleteCommand, DeleteCommandInput } from "@aws-sdk/lib-dynamodb";
import { database, dynamoDBDocument } from "../../../database.js";

import userModel from "../../../models/user.model.js";
import projectModel from "../../../models/project.model.js";
import EDatabase from "../../../constants/eDatabase.js";
import EError from "../../../constants/eError.js";
import ETableName from "../../../constants/eTableName.js";
import taskModel from "../../../models/task.model.js";
import columnModel from "../../../models/column.model.js";

const findByIdAndDeleteDynamoDB = async <P>(
    _id: string,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    const params: DeleteCommandInput = {
        TableName: tableName,
        Key: { _id },
        ReturnValues: "ALL_OLD"
    };

    const command = new DeleteCommand(params);
    const response = await dynamoDBDocument.send(command);

    return response.Attributes != null
        ? (response.Attributes as P & { _id: string })
        : undefined;
};

const findByIdAndDeleteMongoDB = async <P>(
    _id: string,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    let res: (P & { _id: string }) | null;
    switch (tableName) {
        case ETableName.USER:
            res = await userModel.findByIdAndDelete(_id);
            break;
        case ETableName.PROJECT:
            res = await projectModel.findByIdAndDelete(_id);
            break;
        case ETableName.TASK:
            res = await taskModel.findByIdAndDelete(_id);
            break;
        case ETableName.COLUMN:
            res = await columnModel.findByIdAndDelete(_id);
            break;
        default:
            res = null;
            break;
    }
    return res != null ? res : undefined;
};

const findByIdAndDelete = async <P>(
    _id: string,
    tableName: string
): Promise<(P & { _id: string }) | undefined> => {
    try {
        switch (database) {
            case EDatabase.DYNAMODB:
                return await findByIdAndDeleteDynamoDB<P>(_id, tableName);
            case EDatabase.MONGODB:
                return await findByIdAndDeleteMongoDB<P>(_id, tableName);
            default:
                throw new Error(EError.INVALID_DB);
        }
    } catch (error) {
        console.error("Error finding item by id and delete:", error);
    }
};

export default findByIdAndDelete;

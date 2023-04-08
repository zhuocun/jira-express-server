import { dynamoDB } from "../app.js";
import { CreateTableCommandInput } from "@aws-sdk/client-dynamodb";

const createDynamoDBTable = (params: CreateTableCommandInput): void => {
    dynamoDB.describeTable(params, (err) => {
        const tableName: string = params.TableName != null ? params.TableName : "";
        if (err != null) {
            if (err.code === "ResourceNotFoundException") {
                // Table does not exist, create it
                dynamoDB.createTable(params, (err) => {
                    if (err != null) {
                        console.error(`Error creating table ${tableName}:`, err);
                    } else {
                        console.log(`Created table ${tableName}.`);
                    }
                });
            } else {
                console.error(`Error describing table ${tableName}:`, err);
            }
        } else {
            console.log(`Table ${tableName} already exists.`);
        }
    });
};

export default createDynamoDBTable;

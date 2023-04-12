import { dynamoDBClient } from "../database.js";
import { CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";

const createDynamoDBTable = async (tableName: string): Promise<void> => {
    try {
        const command: ListTablesCommand = new ListTablesCommand({});
        const tableList = await dynamoDBClient.send(command);
        if (tableList.TableNames != null && !tableList.TableNames.includes(tableName)) {
            await dynamoDBClient.send(
                new CreateTableCommand({
                    TableName: tableName,
                    KeySchema: [
                        {
                            AttributeName: "_id",
                            KeyType: "HASH"
                        }
                    ],
                    AttributeDefinitions: [
                        {
                            AttributeName: "_id",
                            AttributeType: "S"
                        }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                })
            );
            console.log(`Table ${tableName} created successfully.`);
        }
    } catch (error) {
        if ((error as { code: string }).code === "ResourceInUseException") {
            console.log(`Table ${tableName} already exists.`);
        } else {
            console.error(`Error creating table ${tableName}:`, error);
        }
    }
};

export default createDynamoDBTable;

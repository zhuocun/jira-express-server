import { dynamoDBClient } from "../database.js";
import {
    ListTablesCommand,
    CreateTableCommand
} from "@aws-sdk/client-dynamodb";

const buildExpression = (
    attributeFields: Record<string, any>
): {
    ExpressionAttributeNames: Record<string, string>
    ExpressionAttributeValues: Record<string, any>
    expression: string
} => {
    const ExpressionAttributeNames: Record<string, string> = {};
    const ExpressionAttributeValues: Record<string, any> = {};
    const expressions: string[] = [];

    Object.keys(attributeFields).forEach((attributeName, index) => {
        const nameKey = `#attrName${index}`;
        const valueKey = `:attrValue${index}`;

        ExpressionAttributeNames[nameKey] = attributeName;
        ExpressionAttributeValues[valueKey] = attributeFields[attributeName];
        expressions.push(`${nameKey} = ${valueKey}`);
    });

    return {
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        expression: expressions.join(" AND ")
    };
};

const tableExists = async (tableName: string): Promise<boolean> => {
    const command = new ListTablesCommand({});
    const tableList = await dynamoDBClient.send(command);
    return tableList.TableNames?.includes(tableName) ?? false;
};

const createDynamoDBTable = async (tableName: string): Promise<void> => {
    try {
        const command: ListTablesCommand = new ListTablesCommand({});
        const tableList = await dynamoDBClient.send(command);
        if (
            tableList.TableNames != null &&
            !tableList.TableNames.includes(tableName)
        ) {
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

export { buildExpression, tableExists, createDynamoDBTable };

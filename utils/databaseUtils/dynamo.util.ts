import { dynamoDBClient } from "../../database.js";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";

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

export { buildExpression, tableExists };

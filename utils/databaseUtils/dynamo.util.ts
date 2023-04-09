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
        ExpressionAttributeNames[valueKey] = attributeFields[attributeName];
        expressions.push(`${nameKey} = ${valueKey}`);
    });

    return {
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        expression: expressions.join(" AND ")
    };
};

export { buildExpression };

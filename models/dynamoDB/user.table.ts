import createDynamoDBTable from "../../utils/dynamo.util.js";

const userTableParams = {
    TableName: "User",
    KeySchema: [
        { AttributeName: "username", KeyType: "HASH" },
        { AttributeName: "email", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
        { AttributeName: "username", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    StreamSpecification: {
        StreamEnabled: false
    }
};

createDynamoDBTable(userTableParams);
